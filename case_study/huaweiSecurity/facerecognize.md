# This is the case of fuzzing `facerecognize` of [huawei security service](https://developer.huawei.com/consumer/cn/doc/development/Security-Guides/introduction-0000001051219741).
The service is built upon `AIDL` rather than `HIDL`.


# S1： Collecting information
A. Use the [Frida Gadget](https://frida.re/docs/gadget/) to process the [Sample](https://developer.huawei.com/consumer/cn/doc/development/Security-Library/sdk-download-0000001051341710). \
B. The `mData` is dumped as:

```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73c1cff100  00 00 00 80 ff ff ff ff 3f 00 00 00 68 00 75 00  ........?...h.u.
73c1cff110  61 00 77 00 65 00 69 00 2e 00 61 00 6e 00 64 00  a.w.e.i...a.n.d.
73c1cff120  72 00 6f 00 69 00 64 00 2e 00 73 00 65 00 63 00  r.o.i.d...s.e.c.
73c1cff130  75 00 72 00 69 00 74 00 79 00 2e 00 66 00 61 00  u.r.i.t.y...f.a.
73c1cff140  63 00 65 00 72 00 65 00 63 00 6f 00 67 00 6e 00  c.e.r.e.c.o.g.n.
73c1cff150  69 00 74 00 69 00 6f 00 6e 00 2e 00 49 00 46 00  i.t.i.o.n...I.F.
73c1cff160  61 00 63 00 65 00 52 00 65 00 63 00 6f 00 67 00  a.c.e.R.e.c.o.g.
73c1cff170  6e 00 69 00 7a 00 65 00 53 00 65 00 72 00 76 00  n.i.z.e.S.e.r.v.
73c1cff180  69 00 63 00 65 00 45 00 78 00 00 00 85 2a 62 73  i.c.e.E.x....*bs
73c1cff190  13 01 00 00 e0 87 15 c2 73 00 00 00 40 c4 f2 c1  ........s...@...
73c1cff1a0  73 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00  s...............
73c1cff1b0  00 00 00 00 00 00 00 00 1a 00 00 00 63 00 6f 00  ............c.o.
73c1cff1c0  6d 00 2e 00 68 00 75 00 61 00 77 00 65 00 69 00  m...h.u.a.w.e.i.
73c1cff1d0  2e 00 66 00 61 00 63 00 65 00 6d 00 61 00 6e 00  ..f.a.c.e.m.a.n.
73c1cff1e0  61 00 67 00 65 00 72 00 74 00 65 00 73 00 74 00  a.g.e.r.t.e.s.t.
73c1cff1f0  00 00 00 00 85 2a 62 73 13 01 00 00 00 88 15 c2  .....*bs........
73c1cff200  73 00 00 00 f0 c3 f2 c1 73 00 00 00              s.......s...
```

We profile the `mData` in the `Parcel` as:
```
0      0x04    0x08  0x0c  0x8c   0x90    0x94     0x9c     0xa4  0xb8        0xf4   0xf8    0xfc     0x104    0x01c
|-------|-------|-----|-----|------|-------|--------|--------|-----|-----------|------|-------|--------|--------| 
| Int32 | Int32 | len | str | type | flags | binder | cookie | N/A | len | str | type | flags | binder | cookie |
|       InterfaceToken      |       flat_binder_object       | N/A |  String16 |       flat_binder_object       |     
```

`huawei.android.security.facerecognition.IFaceRecognizeServiceEx`
