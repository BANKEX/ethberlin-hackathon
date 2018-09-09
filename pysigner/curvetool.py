#!/usr/bin/env python3
from sapling_jubjub import *
import hashlib
import os, codecs
from ed25519 import *
from json import dumps, loads

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


def genCert(filename):
  sk = codecs.encode(os.urandom(16), 'hex').decode()
  pk = publickey(sk)
  bpk = list(map(bitify, pk))
  wrf(filename, dumps({"sk":sk, "pk":pk, "pk_bits":bpk}))



def sign(messagefile, certfile):
  cert = loads(rdf(certfile))
  msg = loads(rdf(messagefile))
  R,S = signature(msg["m"],cert["sk"],cert["pk"])
  msg["R"] = R
  msg["S"] = S
  msg["R_bits"] = list(map(bitify, R))
  msg["S_bits"] = bitify(S)
  msg["m_bits"] = toBin("0x"+msg["m"])
  wrf(messagefile, dumps(msg))

def check(messagefile, certfile):
  cert = loads(rdf(certfile))
  msg = loads(rdf(messagefile))
  try:
    checkvalid(msg["R"],msg["S"],msg["m"],cert["pk"])
  except:
    return False
  return True


from sys import argv

if argv[1] == "gencert":
  genCert(argv[2])
elif argv[1] == "sign":
  sign(argv[2], argv[3])
elif argv[1] == "check":
  print(check(argv[2], argv[3]))

    
