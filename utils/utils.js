/***************************************************
** used to search for the target function **
***************************************************/
function funcHelper(mangled_name){
    console.log("[i] searching for: " + mangled_name)
    var addr_map = new Map();

    var ms = Process.enumerateModules();
    for (var i = 0; i < ms.length; i ++ )
    {
        try{
            var func_ptr = Module.getExportByName(ms[i].path, mangled_name).toString(16);
            if (func_ptr != 0)
            {
                // console.log("[i] verbose info: " + ms[i].path + ", " + func_ptr);

                if (!addr_map.has(func_ptr))
                {
                    if (ms[i].path != g_module['sys'])
                        g_module['app'] = ms[i].path
                    addr_map.set(func_ptr, ms[i].path);
                }
            }
        }
        catch(err) {
            console.error(err);
        }
    }

    for (let [key, value] of addr_map.entries())
    {
        console.log("[i] " + mangled_name + ": " + value + ": 0x" + key);
    }
}

/***************************************************
** used to generate seed for fuzzing **
***************************************************/
function genSeed(org_value)
{
    return [//org_value,           // replay (test double-free?)
                    ~org_value,
                    org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
                    org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
                    org_value & 0xffffff00 + 0x7f, org_value & 0xffff00ff + 0x7f00, org_value & 0xff00ffff + 0x7f0000, org_value & 0x00ffffff + 0x7f000000,
                    org_value & 0xffffff00 + 0x80, org_value & 0xffff00ff + 0x8000, org_value & 0xff00ffff + 0x800000, org_value & 0x00ffffff + 0x80000000,
                    0,
                    0x7f, 0x7fff, 0x7fffff, 0x7fffffff,
                    0x80, 0x8000, 0x800000, 0x80000000,
                    0xff, 0xffff, 0xffffff,
                    0xffffffff,
                    org_value + 1, org_value + 0x100, org_value + 0x10000, org_value + 0x1000000,
                    org_value - 1, org_value - 0x100, org_value - 0x10000, org_value - 0x1000000,
                    0x41414141,
                    ];
}
