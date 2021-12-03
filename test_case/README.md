## `test_case1` is used to verify my code run correctly.

By using `test_case1`, I find the `transact` is thunked to a place different from the one retrieved by using `Module.getExportByName("libhidlbase.so"`. At last, I find it is actually thunked to `"/system/lib64/vndk-sp-29/libhidlbase.so"` (see `f168` in `test_case1.js`).
So I feed the `Module.getExportByName()` with full path to intercept all `transact`s.