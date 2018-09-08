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


bitify = lambda P : toBin(hex(int(''.join(str(e) for e in hexToBinary(hex(P))[::-1]),2)))

Bx = 17777552123799933955779906779655732241715742912184938656739573121738514868268 
By = 2626589144620713026669568689430873010625803728049924121243784502389097019475

base = Point(Fq(Bx), Fq(By))


msghexify = lambda x: "".join(["0"]*(66-len(hex(x)))+[hex(x)[2:]])

fp = open("sample.txt", "w")

npoints = 5
fp.write(str(npoints)+"\n")
messages = [randint(0, 100) for i in range(0,npoints)]
_median = median(messages)
data = []

a_sk = [0]*npoints
a_pk = [0]*npoints

fp.write(str(_median)+"\n")

for i in range(0, npoints):
  sk = codecs.encode(os.urandom(16), 'hex').decode()
  a_sk[i] = sk
  pk = publickey(sk)
  a_pk[i] = pk
  bpk = list(map(bitify, pk))
  fp.write(" ".join(list(map(str, bpk[0])))+"\n")
  fp.write(" ".join(list(map(str, bpk[1])))+"\n")

for i in range(0, npoints):
  R,S = signature(msghexify(messages[i]), a_sk[i],a_pk[i])

  R_bits = list(map(bitify, R))
  fp.write(" ".join(list(map(str, R_bits[0])))+"\n")
  fp.write(" ".join(list(map(str, R_bits[1])))+"\n")
  
  S_bits = bitify(S)
  fp.write(" ".join(list(map(str, S_bits)))+"\n")
  
  m_bits = toBin("0x"+msghexify(messages[i]))
  fp.write(" ".join(list(map(str, m_bits)))+"\n")

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