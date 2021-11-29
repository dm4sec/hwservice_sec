// Scan for the transaction code, arguments and their type
#include <idc.idc>

// scan the new func, feed the new ea of the func.
static collect_f(_ea, _logfile)
{
  // go .plt firstly, then reach the real impl.
  auto ea, inst_info, callee_ea, end_ea;
  ea = _ea;

  if (get_segm_name(ea) == ".plt")
  {
    ea = ea + 0xc;
    inst_info = decode_insn(ea);
    // `BR`
    if ( inst_info == 0 )
    {
      return;
    }
    if (inst_info.itype != 470)
    {
      return;
    }

    ea = get_first_fcref_from(ea);
    if (ea == BADADDR)
    {
      return;
    }

    end_ea = find_func_end(ea);
    if (end_ea == BADADDR)
    {
      return;
    }

    while( ea != BADADDR && ea != end_ea)
    {
      inst_info = decode_insn(ea);
      if (inst_info == 0)
      {
        ea = next_head(ea, end_ea);
        continue;
      }
      // should be a `BL` inst.
      if (inst_info.itype != 4)
      {
        ea = next_head(ea, end_ea);
        continue;
      }
      callee_ea = get_first_fcref_from(ea);
      if (ea == BADADDR)
      {
        ea = next_head(ea, end_ea);
        continue;
      }
      auto callee_name = demangle_name(get_func_name(callee_ea), get_inf_attr(INF_LONG_DN));
      if ( callee_name == 0 )
      {
        ea = next_head(ea, end_ea);
        continue;
      }

      if ( strstr(callee_name, "android::hardware::Parcel::write") != -1 )
      {
        msg( "  C: 0x%X -> 0x%X: %s\n", ea, callee_ea, callee_name );
        if (ARGV.count != 1)
        {
          fprintf(_logfile, "C: 0x%X -> 0x%X: %s\n", ea, callee_ea, callee_name);
        }
      }
      ea = next_head(ea, end_ea);
    }
  }
}

static main()
{
  // http://www.bejson.com/convert/ox2str/
  // https://www.hex-rays.com/products/ida/debugger/scriptable.shtml
  // https://hex-rays.com/products/ida/support/idadoc/index.shtml
  // https://hex-rays.com/products/ida/support/idadoc/157.shtml
  // https://www.hex-rays.com/products/ida/support/idadoc/162.shtml
  // https://hex-rays.com/wp-content/static/products/ida/support/idapython_docs/idc.html
  // https://hex-rays.com/wp-content/static/products/ida/support/idapython_docs/ida_allins.html#ida_allins.ARM_mov

  // search for the method in *BpHw* namespace with signature `*:*:BpHw*::_hidl_`

  auto ea, func_name, end_ea, callee_ea, callee_name, c, inst_info;
  ea = 0;

  // msg( "%s.\n", ARGV[1] );
  // ARGV[0] = "/Users/panmac/Desktop/workspace/hwservice_sec/code/log.txt.tmp";
  auto logfile;
  if (ARGV.count != 1)
  {
    logfile = fopen(ARGV[1], "wb");
  }

  while( ea != BADADDR )
  {
    func_name = demangle_name(get_func_name(ea), get_inf_attr(INF_LONG_DN));
    if ( func_name == 0 )
    {
      ea = get_next_func(ea);
      continue;
    }
    if(
      strstr(func_name, "::BpHw") != -1 &&
      strstr(func_name, "::_hidl_") != -1 &&
      strstr(func_name, "::BpHwBase") == -1 &&
      get_segm_name(ea) == ".text"
    )
    {
      end_ea = find_func_end(ea);
      msg( "F: 0x%X - 0x%X: %s\n", ea, end_ea, func_name );
      if (ARGV.count != 1)
      {
        fprintf(logfile, "F: 0x%X - 0x%X: %s\n", ea, end_ea, func_name );
      }
      // collect `write*` until `asBinder`

      while( ea != end_ea && ea != BADADDR)
      {
        // msg( ">> 0x%X - 0x%X.\n", ea, end_ea );

        inst_info = decode_insn(ea);
        if (inst_info == 0)
        {
          ea = next_head(ea, end_ea);
          continue;
        }
        // should be a `BL` inst.
        if (inst_info.itype != 4)
        {
          ea = next_head(ea, end_ea);
          continue;
        }
        callee_ea = get_first_fcref_from(ea);
        if (callee_ea == BADADDR)
        {
          ea = next_head(ea, end_ea);
          continue;
        }
        callee_name = demangle_name(get_func_name(callee_ea), get_inf_attr(INF_LONG_DN));
        if ( callee_name == 0 )
        {
          ea = next_head(ea, end_ea);
          continue;
        }

        if ( strstr(callee_name, "write") != -1 )
        {
          if (strstr(callee_name, "::writeEmbeddedToParcel") != -1 && strstr(callee_name, "android::hardware::writeEmbeddedToParcel") == -1)
          {
            // vendor::huawei::hardware::jpegdec::V1_0::BpHwJpegDecode::_hidl_DoDecode(android::hardware::IInterface*, android::hardware::details::HidlInstrumentor*, vendor::huawei::hardware::jpegdec::V1_0::jpeg_decompress_hidl_t const&, android::hardware::hidl_handle const&, android::hardware::hidl_handle const&, vendor::huawei::hardware::jpegdec::V1_0::hwdecode_region_info const&, int, int)
            // -> vendor::huawei::hardware::jpegdec::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::jpegdec::V1_0::jpeg_decompress_hidl_t const&, android::hardware::Parcel*, unsigned long, unsigned long)
            // -> android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)

            msg( "G: *** Vendor's implementation, shall verify the below result ***: 0x%X -> 0x%X: %s\n", ea, callee_ea, callee_name );
            collect_f(callee_ea, logfile);
          }
          else if (strstr(callee_name, "android::hardware::") != -1 && strstr(callee_name, "::write") != -1)
          {
            msg( "C: 0x%X -> 0x%X: %s\n", ea, callee_ea, callee_name );
            if (ARGV.count != 1)
            {
              fprintf(logfile, "C: 0x%X -> 0x%X: %s\n", ea, callee_ea, callee_name);
            }
          }
          else
          {
            msg( "TODO: 0x%X -> 0x%X: %s\n", ea, callee_ea, callee_name );
          }
          ea = next_head(ea, end_ea);
          continue;
        }

        if ( strstr(callee_name, "asBinder") != -1 )
        {
          c = 0;
          while( ea != end_ea && ea != BADADDR && c < 10 )
          {
            c ++;
            ea = next_head(ea, end_ea);
            // must be a `MOV` inst.
            inst_info = decode_insn(ea);
            if (inst_info != 0 &&
              inst_info.itype == 23 &&
              inst_info.n == 2 &&
              inst_info.Op0.type == o_reg &&
              inst_info.Op0.reg == 130 &&
              inst_info.Op1.type == o_imm)
            {
              msg( "T: Transaction code at 0x%X: %d\n", ea, inst_info.Op1.value );
              if (ARGV.count != 1)
              {
                fprintf(logfile, "T: Transaction code at 0x%X: %d\n", ea, inst_info.Op1.value );
              }
              break;
            }
          }
          break;
        }
        ea = next_head(ea, end_ea);
      }
    }
    ea = get_next_func(ea);
  }
  fclose(logfile);
  if (ARGV.count != 1)
  {
    Exit(0); // Exit IDA Pro `used in batch mode`
  }
}