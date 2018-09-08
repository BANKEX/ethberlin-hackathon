Tool to use signature with baby_jubjub curve


use pysigner/curvetool.py

```
curvetool.py gencert cert.txt
```
create certificate with private and public keys

```
curvetool.py sign  message.txt cert.txt
```
create certificate with private and public keys


```
curvetool.py gencert message.txt cert.txt
```
create certificate with private and public keys


message txt format:

```
{
  "m":"64 hexadecimal syumbols"
}
```


use generatestatdata.py to compute sample.txt