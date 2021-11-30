// https://frida.re/docs/javascript-api/

Java.perform(function () {

    // helper func to locate the mData, mDataSize, mObjects, mObjectsSize or sth else. May varies in different box, so run this helper func first.
    /* the output indicates that the:
    0x28: should be the member variable `mData`
    0x30: should be the member variable `mDataSize`
    0x48: should be the member variable `mObjects`, which points to an array of offsets in `mData`.
    0x50: should be the member variable `mObjectsSize`.
    e.g.,
                 0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
    760c75ee30  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    760c75ee40  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    760c75ee50  00 00 00 00 76 00 00 00 20 7d c7 5c 76 00 00 00  ....v... }.\v...
    760c75ee60  88 00 00 00 00 00 00 00 8a 00 00 00 00 00 00 00  ................
    760c75ee70  88 00 00 00 00 00 00 00 80 98 c0 5c 76 00 00 00  ...........\v...
    760c75ee80  02 00 00 00 00 00 00 00 03 00 00 00 00 00 00 00  ................
    760c75ee90  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
    760c75eea0  01 00 01 0c 76 00 00 00 00 00 00 00 00 00 00 00  ....v...........
    760c75eeb0  00 05 00 00 00 00 00 00 01 83 8b 35 01 00 00 00  ...........5....
    760c75eec0  90 f0 75 0c 76 00 00 00 90 f0 75 0c 76 00 00 00  ..u.v.....u.v...
    760c75eed0  20 00 76 0c 76 00 00 00 70 83 8b 35 fa 21 dd 74   .v.v...p..5.!.t
    760c75eee0  a0 06 9b ed 76 00 00 00 00 05 00 00 00 00 00 00  ....v...........
    760c75eef0  20 00 76 0c 76 00 00 00 c8 4b 17 58 76 00 00 00   .v.v....K.Xv...
    760c75ef00  f0 4b 17 58 76 00 00 00 58 f0 75 0c 76 00 00 00  .K.Xv...X.u.v...
    760c75ef10  00 00 00 00 00 00 00 00 30 00 00 00 00 00 00 00  ........0.......
    760c75ef20  70 83 8b 35 fa 21 dd 74 54 a3 f1 eb 76 00 00 00  p..5.!.tT...v...

    [i] Checking: 0x760c75ee58
    [i] Probing: 0x765cc77d20
    [i] Offset: 0x28
    [i] Mumber data:
                 0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
    765cc77d20  61 6e 64 72 6f 69 64 2e 68 61 72 64 77 61 72 65  android.hardware
    765cc77d30  2e 67 72 61 70 68 69 63 73 2e 61 6c 6c 6f 63 61  .graphics.alloca
    765cc77d40  74 6f 72 40 32 2e 30 3a 3a 49 41 6c 6c 6f 63 61  tor@2.0::IAlloca
    765cc77d50  74 6f 72 00 85 2a 74 70 00 00 00 00 80 f0 75 0c  tor..*tp......u.
    [i] Checking: 0x760c75ee60
    [i] Probing: 0x88
    [i] Offset: 0x30

    [i] Checking: 0x760c75ee78
    [i] Probing: 0x765cc09880
    [i] Offset: 0x48
    [i] Mumber data:
                 0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
    765cc09880  34 00 00 00 00 00 00 00 5c 00 00 00 00 00 00 00  4.......\.......
    765cc09890  22 00 00 00 00 01 02 00 00 00 00 00 30 00 00 00  "...........0...
    765cc098a0  30 8a ff ea 76 00 00 00 00 00 00 00 00 00 00 00  0...v...........
    765cc098b0  00 00 00 00 00 00 00 00 00 00 31 2e 30 00 00 00  ..........1.0...
    [i] Checking: 0x760c75ee80
    [i] Probing: 0x2
    [i] Offset: 0x50

    see also: system/libhwbinder/include/hwbinder/Parcel.h
    */
    function probeParcelData(parcel_data_pos){
        var mem_block = 256
        var parcel_data = hexdump(parcel_data_pos, {
            offset: 0,
            length: mem_block,
            header: true,
            ansi: true
        });
        console.log(parcel_data)

        // probe the mData pos.
        var cur_offset = 0;
        var cur_pos = parcel_data_pos;
        while (cur_offset < mem_block) {
            console.log("[i] Checking: " + cur_pos);
            var buf_pointer = cur_pos.readPointer();
            console.log("[i] Probing: " + buf_pointer);

            try {
                console.log("[i] Offset: 0x" + cur_offset.toString(16));
                var mumber_data = hexdump(buf_pointer, {
                    offset: 0,
                    length: 0x40,
                    header: true,
                    ansi: true
                });
                console.log("[i] Mumber data: ");
                console.log(mumber_data);
            }
            catch(err) {
                console.log("[e] Can't read: " + cur_pos + "(" + buf_pointer + ")");
            }

            cur_pos = cur_pos.add(0x8);
            cur_offset += 0x8;
        }
    }

    // fuzz the object
    function fuzzObject(mData_pos, mObjects_pos, mObjectsSize){
        // parse each Object
        for (var i = 0; i < mObjectsSize; i ++)
        {
            console.log("\t\t\t[i] dumping binder_object: " + i);
            var binder_object_offset = mObjects_pos.add(i * 0x8).readU64();
            var binder_object_pos = mData_pos.add(binder_object_offset);
            var type_pos = binder_object_pos;

            console.log("\t\t\t\t[-] type:");
            console.log(hexdump(type_pos, {
                offset: 0,
                length: 0x4,
                header: true,
                ansi: true
            }));

            /*
            system/libhwbinder/Parcel.cpp
            /usr/include/linux/android/binder.h

            enum {
                BINDER_TYPE_BINDER	= B_PACK_CHARS('s', 'b', '*', B_TYPE_LARGE),
                BINDER_TYPE_WEAK_BINDER	= B_PACK_CHARS('w', 'b', '*', B_TYPE_LARGE),
                BINDER_TYPE_HANDLE	= B_PACK_CHARS('s', 'h', '*', B_TYPE_LARGE),
                BINDER_TYPE_WEAK_HANDLE	= B_PACK_CHARS('w', 'h', '*', B_TYPE_LARGE),
                BINDER_TYPE_FD		= B_PACK_CHARS('f', 'd', '*', B_TYPE_LARGE),
                BINDER_TYPE_FDA		= B_PACK_CHARS('f', 'd', 'a', B_TYPE_LARGE),
                BINDER_TYPE_PTR		= B_PACK_CHARS('p', 't', '*', B_TYPE_LARGE),
            };
            */
            var BINDER_TYPE_PTR             = 0x70742a85                //.*tp
            var BINDER_TYPE_BINDER          = 0x73622a85                //.*bs

            if (type_pos.readU32() == BINDER_TYPE_PTR)
            {
                console.log("\t\t\t\t[i] identified as BINDER_TYPE_PTR, parse by following struct `binder_buffer_object`.");
                var BINDER_BUFFER_FLAG_HAS_PARENT   = 0x01;
                var BINDER_BUFFER_FLAG_REF          = 0x1 << 1;

                /*
                struct binder_object_header {
                    __u32        type;
                };
                struct binder_buffer_object {
                    struct binder_object_header	hdr;
                    __u32				flags;
                    binder_uintptr_t		buffer;
                    binder_size_t			length;
                    binder_size_t			parent;
                    binder_size_t			parent_offset;
                };
                */
                var flags_pos = binder_object_pos.add(0x4);
                var buffer_pos = binder_object_pos.add(0x8);
                var length_pos = binder_object_pos.add(0x10);
                var parent_pos = binder_object_pos.add(0x18);
                var parent_offset_pos = binder_object_pos.add(0x20);

                console.log("\t\t\t\t[-] flags: 0x" + flags_pos.readU32().toString(16));

                if (flags_pos.readU32() == BINDER_BUFFER_FLAG_HAS_PARENT)
                {
                    // writeEmbeddedBuffer
                    console.log("\t\t\t\t[-] assembled by `writeEmbeddedBuffer`");
                    console.log("\t\t\t\t[-] buffer: " + buffer_pos.readPointer());
                    if(length_pos.readU64() != 0)
                    {
                        console.log("\t\t\t\t[-] buffer content: ");
                        console.log(hexdump(buffer_pos.readPointer(), {
                            offset: 0,
                            length: length_pos.readU64(),
                            header: true,
                            ansi: true
                        }));
                    }
                    else
                    {
                        // parent and parent_offset take place.
                        // check validateBufferParent to find out how they are used.
                        // used to point to another BINDER_TYPE_PTR, such that modify one of them is enough.
                    }
                    console.log("\t\t\t\t[-] length: 0x" + length_pos.readU64().toString(16));
                    console.log("\t\t\t\t[-] parent: 0x" + parent_pos.readU64().toString(16));
                    console.log("\t\t\t\t[-] parent_offset: 0x" + parent_offset_pos.readU64().toString(16));
                }
                else if (flags_pos.readU32() == 0)
                {
                    // writeBuffer
                    console.log("\t\t\t\t[-] assembled by `writeBuffer`");
                    console.log("\t\t\t\t[-] buffer: " + buffer_pos.readPointer());
                    if(length_pos.readU64() != 0)
                    {
                        console.log("\t\t\t\t[-] buffer content: ");
                        console.log(hexdump(buffer_pos.readPointer(), {
                            offset: 0,
                            length: length_pos.readU64(),
                            header: true,
                            ansi: true
                        }));
                    }
                    else
                    {
                        console.log("\t\t\t\t[e] never run ME");
                    }
                    console.log("\t\t\t\t[-] length: 0x" + length_pos.readU64().toString(16));
                }
                else if (flags_pos.readU32() == BINDER_BUFFER_FLAG_REF)
                {
                    // writeReference
                    // writeNullReference
                    // have not tested.
                    if (buffer_pos.readU64() == 0)
                    {
                        console.log("\t\t\t\t[-] assembled by `writeNullReference`");
                    }
                    else
                    {
                        console.log("\t\t\t\t[-] assembled by `writeReference`");
                        console.log("\t\t\t\t[-] buffer (child_buffer_handle): 0x" + buffer_pos.readU64().toString(16));
                        console.log("\t\t\t\t[-] length (child_offset): 0x" + length_pos.readU64().toString(16));
                    }
                }
                else if (flags_pos.readU32() == BINDER_BUFFER_FLAG_REF | BINDER_BUFFER_FLAG_HAS_PARENT)
                {
                    // writeEmbeddedReference
                    // have not tested.
                    console.log("\t\t\t\t[-] assembled by `writeEmbeddedReference`");
                    console.log("\t\t\t\t[-] buffer (child_buffer_handle): 0x" + buffer_pos.readU64().toString(16));
                    console.log("\t\t\t\t[-] length (child_offset): 0x" + length_pos.readU64().toString(16));
                    console.log("\t\t\t\t[-] parent (parent_buffer_handle): 0x" + parent_pos.readU64().toString(16));
                    console.log("\t\t\t\t[-] parent_offset (parent_offset): 0x" + parent_offset_pos.readU64().toString(16));
                }
                else
                {
                    console.log("\t\t\t\t[e] TODO:: unknown BINDER_TYPE_PTR");
                }

                // I would like that you should check the flags in advance to know how this data is assembled (e.g., by using writeEmbeddedBuffer or writeBuffer).
            }
            else if (type_pos.readU32() == BINDER_TYPE_BINDER)
            {
                // check `BHwBinder` in system/libhwbinder/include/hwbinder/Binder.h, I don't think there are any thing we can fuzz.
                console.log("\t\t\t\t[i] identified as BINDER_TYPE_BINDER, parse by following struct `flat_binder_object`.");

                /*
                struct binder_object_header {
                    __u32        type;
                };

                struct flat_binder_object {
                    struct binder_object_header	hdr;
                    __u32				flags;

                    union {
                        binder_uintptr_t	binder;
                        __u32			handle;
                    };

                    binder_uintptr_t	cookie;
                };
                */

                var flags_pos = binder_object_pos.add(0x4);
                var binder_or_handle_pos = binder_object_pos.add(0x8);
                var cookie_pos = binder_object_pos.add(0x10);

                console.log("\t\t\t\t[-] flags: 0x" + flags_pos.readU32().toString(16));

                if (binder_or_handle_pos.readU64() == 0)
                {
                    console.log("\t\t\t\t[-] assembled by `writeStrongBinder->flatten_binder->binder == null` or `writeWeakBinder->flatten_binder->binder == null / real == null`");
                }
                else
                {
                    console.log("\t\t\t\t[-] assembled by `writeStrongBinder->flatten_binder->local binder`");

                    console.log("\t\t\t\t[-] binder_or_handle (binder): 0x" + binder_or_handle_pos.readU64().toString(16));     // weak / strong reference
                    console.log("\t\t\t\t[-] cookie: 0x" + cookie_pos.readU64().toString(16));                                  // binder object
                }

            }
            else
            {
                console.log("\t\t\t\t[e] TODO:: Unknown BINDER_TYPE");
            }
            console.log("\t\t\t[i] end dumping binder_object: " + i);
        }
    }

    // defined in system/libhwbinder/Parcel.cpp
    function PAD_SIZE_UNSAFE(s)
    {
        return (((s)+3)&~3)
    }

    function fuzzOneUInt()
    {
        //TODO
    }

    function getBinderObjectLen(BinderObjectPos)
    {
            /*
            system/libhwbinder/Parcel.cpp
            /usr/include/linux/android/binder.h

            enum {
                BINDER_TYPE_BINDER	= B_PACK_CHARS('s', 'b', '*', B_TYPE_LARGE),
                BINDER_TYPE_WEAK_BINDER	= B_PACK_CHARS('w', 'b', '*', B_TYPE_LARGE),
                BINDER_TYPE_HANDLE	= B_PACK_CHARS('s', 'h', '*', B_TYPE_LARGE),
                BINDER_TYPE_WEAK_HANDLE	= B_PACK_CHARS('w', 'h', '*', B_TYPE_LARGE),
                BINDER_TYPE_FD		= B_PACK_CHARS('f', 'd', '*', B_TYPE_LARGE),
                BINDER_TYPE_FDA		= B_PACK_CHARS('f', 'd', 'a', B_TYPE_LARGE),
                BINDER_TYPE_PTR		= B_PACK_CHARS('p', 't', '*', B_TYPE_LARGE),
            };
            */
            var BINDER_TYPE_BINDER          = 0x73622a85                // .*bs
            var BINDER_TYPE_WEAK_BINDER     = 0x77622a85                // .*bw
            var BINDER_TYPE_HANDLE          = 0x73682a85                // .*hs
            var BINDER_TYPE_WEAK_HANDLE     = 0x77682a85                // .*hw
            var BINDER_TYPE_FD              = 0x66642a85                // .*df
            var BINDER_TYPE_FDA             = 0x66646185                // .adf
            var BINDER_TYPE_PTR             = 0x70742a85                // .*tp

            var type_val = BinderObjectPos.readU32();
            if (type_val == BINDER_TYPE_BINDER ||
                type_val == BINDER_TYPE_WEAK_BINDER ||
                type_val == BINDER_TYPE_HANDLE ||
                type_val == BINDER_TYPE_WEAK_HANDLE)            // flat_binder_object
                return 0x18;
            else if (type_val == BINDER_TYPE_FD)                // flat_binder_object
                return 0x18;
            else if (type_val == BINDER_TYPE_FDA)               // binder_fd_array_object
                return 0x28;
            else if (type_val == BINDER_TYPE_PTR)               // binder_buffer_object
                return 0x28;
    }

    // fuzz the Peekhole in mData
    function fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize){
        console.log("|---[i] start fuzzing peekhole in mData");

        // dump data for debugging
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: mDataSize,
            header: true,
            ansi: true
        }));

        var object_offset_lst = new Array();;
        for (var i = 0; i < mObjectsSize; i ++)
        {
            object_offset_lst[i] = mObjects_pos.add(i * 0x8).readU64().toNumber();
        }
        console.log("|----[i] binder_object offset: " + object_offset_lst);

        // skip the descriptor
        for (var i = 0; i < mDataSize; i ++)
        {
            if (mData_pos.add(i).readU8() == 0)
            {
                break;
            }
        }
        // pad i to next block
        i = PAD_SIZE_UNSAFE(i + 1)
        console.log("|----[i] cur offset: 0x" + i.toString(16));
        // console.log("type i " + typeof i)

        for (; i < mDataSize; i += 4 )      // likely all dataz are aligned, I have not check all of them.
        {
            if (object_offset_lst.includes(i))
            {
                i += getBinderObjectLen(mData_pos.add(i));
                i -= 4;
            }
            else
            {
                console.log("|----[i] fuzz offset: 0x" + i.toString(16));
            }
        }

    }

    console.log('[*] Frida js is running.')

    // Use the mangled name
    var BpHwBinder_transact_p = Module.getExportByName("libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + BpHwBinder_transact_p)
    // system/libhwbinder/IPCThreadState.cpp
    //status_t IPCThreadState::transact(int32_t handle,
    //                             uint32_t code, const Parcel& data,
    //                             Parcel* reply, uint32_t flags)

    // In order to reach this function, I need to invoke `IPCThreadState::self()` firstly (as the 1st argument) and locate the `mHandle` variable.
    var IPCThreadState_transact_p = Module.getExportByName("libhidlbase.so", '_ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j');
    console.log("[i] IPCThreadState::transact addr: " + IPCThreadState_transact_p)

    // system/libhwbinder/BpHwBinder.cpp
    //status_t BpHwBinder::transact(
    //    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags, TransactCallback /*callback*/)
    //{
    //    // Once a binder has died, it will never come back to life.
    //    if (mAlive) {
    //        status_t status = IPCThreadState::self()->transact(
    //            mHandle, code, data, reply, flags);
    //        if (status == DEAD_OBJECT) mAlive = 0;
    //        return status;
    //    }
    //
    //    return DEAD_OBJECT;
    //}

    Interceptor.attach(BpHwBinder_transact_p, {
        onEnter: function(args) {
            console.log("[*] onEnter")

            // args[0], `this` argument
            // console.log("[i] 1st argument, this: " + args[0].toInt32())

            // transact code
            console.log("|-[i] 2nd argument, transaction code: " + args[1].toInt32())

            // Parcel data
            console.log("|-[i] 3rd argument, Parcel addr: " + args[2])
            // probeParcelData(args[2])

            // mDataSize
            var mDataSize_pos = args[2].add(0x30);
            var mDataSize = mDataSize_pos.readU64();
            console.log("|--[i] mDataSize: 0x" + mDataSize.toString(16));

            // mData
            var mData_offset = args[2].add(0x28);
            var mData_pos = mData_offset.readPointer();
            // var mData = ArrayBuffer.wrap(mData_pos, mDataSize);
            // var mData = mData_pos.readByteArray(mDataSize);

            var mData = hexdump(mData_pos, {
                offset: 0,
                length: mDataSize,
                header: true,
                ansi: true
            });
            console.log("|--[i] mData: ");
            console.log(mData);

            // mObjectsSize
            var mObjectsSize_pos = args[2].add(0x50);
            var mObjectsSize = mObjectsSize_pos.readU64();
            console.log("|--[i] mObjectsSize: 0x" + mObjectsSize.toString(16));

            var mObjects_offset = args[2].add(0x48);
            var mObjects_pos = mObjects_offset.readPointer();
            // var mObjects = mObjects_pos.readByteArray(mObjectsSize * 0x8);

            var mObjects = hexdump(mObjects_pos, {
                offset: 0,
                length: mObjectsSize * 0x8,
                header: true,
                ansi: true
            });
            console.log("|--[i] mObjects: ");
            console.log(mObjects);

            // start parsing the mData
            // the layout of mData is:
            // |--descriptor--|--peekhole--|--Object--|--peekhole--|--peekhole--|--Object--|...
            // the mObjects[x] indicates the start of each `Object`
            // all Objects are defined in `/usr/include/linux/android/binder.h`

            // e.g., binder_buffer_object
            /*
            struct binder_buffer_object {
              struct binder_object_header hdr;
              __u32 flags;
              binder_uintptr_t buffer;
              binder_size_t length;
              binder_size_t parent;
              binder_size_t parent_offset;
            };

            struct binder_object_header {
              __u32 type;
            };
            */

            // find the descriptor, scan the memory until `00`
            for (var i = 0; i < mDataSize; i ++)
            {
                if (mData_pos.add(i).readU8() == 0)
                {
                    console.log("|---[i] Descriptor: ")
                    console.log(hexdump(mData_pos, {
                        offset: 0,
                        length: i + 1,  // append a `0`
                        header: true,
                        ansi: true
                    }));
                    break;
                }
            }


            // I would like to fuzz in runtime, such that I can covert back to the original mData.
            fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
            // fuzzObject(mData_pos, mObjects_pos, mObjectsSize);

        },


        onLeave: function(retval) {
            console.log("[*] onLeave");
            console.log("\t[i] return value: " + retval);
            // print the return value
        }
    });
});

