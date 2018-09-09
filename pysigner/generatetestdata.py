from sapling_jubjub import *
import hashlib
import os, codecs
from ed25519 import *
from json import dumps, loads
from random import randint
from statistics import median
import pdb


def toBin(x):
    out = [ int(x) for x in bin(int(x, 16))[2:] ]
    out = [0] * (256 - len(out)) + out
    out = list(map(str, out))
    return(out) 

def rdf(nm):
  res=""
  with open(nm,"r") as f:
    res=f.read()
    f.close()
  return res

def wrf(nm, data):
  with open(nm,"w") as f:
    res=f.write(data)



reverse = {
  "0" : "0",
  "1" : "8",
  "2" : "4",
  "3" : "c",
  "4" : "2",
  "5" : "a",
  "6" : "6",
  "7" : "e",
  "8" : "1",
  "9" : "9",
  "a" : "5",
  "b" : "d",
  "c" : "3",
  "d" : "b",
  "e" : "7",
  "f" : "f"
}

bitify = lambda P : toBin(hex(int(''.join(str(e) for e in hexToBinary(hex(P))[::-1]),2)))

Bx = 17777552123799933955779906779655732241715742912184938656739573121738514868268 
By = 2626589144620713026669568689430873010625803728049924121243784502389097019475

base = Point(Fq(Bx), Fq(By))


def msghexify(x):
  data = ["0"]*(66-len(hex(x)))+[hex(x)[2:]]
  data = "".join(data)
  data = [reverse[data[i]] for i in range(63, -1, -1)]
  return "".join(data)


fp = open("input.txt", "w")

npoints = 5
messages = [randint(0, 100) for i in range(0,npoints)]

from sys import argv
if len(argv) > 1:
  messages = loads(rdf(argv[1]))
  npoints = len(messages)


fp.write(str(npoints)+"\n")

_median = median(messages)
data = []

a_sk = [0]*npoints
a_pk = [0]*npoints

fp.write(str(_median)+"\n")

for i in range(0, npoints):
  sk = codecs.encode(os.urandom(16), 'hex').decode()
  a_sk[i] = sk[:]
  pk = publickey(sk)
  a_pk[i] = pk[:]

  pk[0] = hex(int(''.join(str(e) for e in hexToBinary(hex(pk[0]))[::-1]),2))
  pk[1] = hex(int(''.join(str(e) for e in hexToBinary(hex(pk[1]))[::-1]),2))

  pk_x_bin = toBin(pk[0])
  pk_y_bin = toBin(pk[1])

  fp.write(" ".join(pk_x_bin)+"\n")
  fp.write(" ".join(pk_y_bin)+"\n")

for i in range(0, npoints):
  m = msghexify(messages[i])
  R,S = signature(m, a_sk[i],a_pk[i])
  pk = a_pk[i]
  print(checkvalid(R,S,m,pk))

  R[0] = hex(int(''.join(str(e) for e in hexToBinary(hex(R[0]))[::-1]),2))
  R[1] = hex(int(''.join(str(e) for e in hexToBinary(hex(R[1]))[::-1]),2))
  message = hex(int(''.join(str(e) for e in hexToBinary(m)),2))
  S_bin = toBin(hex(S))
  message_bin = toBin(message)
  r_x_bin = toBin(R[0])
  r_y_bin = toBin(R[1])




  fp.write(" ".join(r_x_bin)+"\n")
  fp.write(" ".join(r_y_bin)+"\n")
  fp.write(" ".join(S_bin)+"\n")
  fp.write(" ".join(message_bin)+"\n")

  

fp.close()


"""
median
pk1
pk2
pk3
....
R1
R2
S
m
....

"""