/*    
    copyright 2018 to the baby_jubjub_ecc Authors

    This file is part of baby_jubjub_ecc.

    baby_jubjub_ecc is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    baby_jubjub_ecc is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with baby_jubjub_ecc.  If not, see <https://www.gnu.org/licenses/>.
*/

#include <libsnark/zk_proof_systems/ppzksnark/r1cs_ppzksnark/r1cs_ppzksnark.hpp>


#include "libff/algebra/curves/alt_bn128/alt_bn128_pp.hpp" //hold key
#include "baby_jubjub.hpp"
#include "eddsa.hpp"
#include "pedersen_commitment.hpp"

#include "./export.cpp"



using namespace libsnark;
using namespace libff;
typedef sha256_ethereum HashT;

template<typename ppT, typename HashT>
protoboard<FieldT> trust_setup(const int n, vector<bool> pkx[], vector<bool>  pky[], vector<bool>  rx[],  vector<bool>  ry[], vector<bool>  s[], vector<bool>  m[]){


    typedef libff::Fr<ppT> FieldT;

    protoboard<FieldT> pb;

    // public inputs first

    pb_variable<FieldT> base_x;
    pb_variable<FieldT> base_y;
    base_x.allocate(pb, "base x");
    base_y.allocate(pb, "base y");
    pb.val(base_x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(base_y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");

    // these are public keys,
    // EdDSA public key is a point on a curve

    std::vector<pb_variable_array<FieldT>> pk_x_bins(n);
    std::vector<pb_variable_array<FieldT>> pk_y_bins(n);
    for (size_t i = 0; i < n; i++) {
        pk_x_bins[i].allocate(pb, 256, "pk_x_bin_" + i);
        pk_y_bins[i].allocate(pb, 256, "pk_y_bin_" + i);
        pk_x_bins[i].fill_with_bits(pb, pkx[i]);
        pk_y_bins[i].fill_with_bits(pb, pky[i]);
    }


    std::vector<pb_variable_array<FieldT>> r_x_bins(n);
    std::vector<pb_variable_array<FieldT>> r_y_bins(n);
    std::vector<pb_variable_array<FieldT>> ss(n);

    std::vector<pb_variable_array<FieldT>> ms(n);
    for (size_t i = 0; i < n; i++) {
        r_x_bins[i].allocate(pb, 256, "r_x_bin_" + i);
        r_y_bins[i].allocate(pb, 256, "r_y_bin_" + i);
        r_x_bins[i].fill_with_bits(pb, rx[i]);
        r_y_bins[i].fill_with_bits(pb, ry[i]);

        ss[i].allocate(pb, 256, "s_" + i);
        ss[i].fill_with_bits(pb,  s[i]);
        ms[i].allocate(pb, 256, "m_" + i);
        ms[i].fill_with_bits(pb,  m[i]);
    }

    // domain specification
    // see https://github.com/barryWhiteHat/baby_jubjub for the values
    pb_variable<FieldT> a;
    pb_variable<FieldT> d;
    a.allocate(pb, "a");
    d.allocate(pb, "d");
    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    std::vector<eddsa<FieldT, HashT>> signature_verifiers;
    for (size_t i = 0; i < n; i++) {
        signature_verifiers.emplace_back(eddsa<FieldT, HashT>(pb, a, d, pk_x_bins[i], pk_y_bins[i], base_x, base_y, r_x_bins[i], r_y_bins[i], ms[i], ss[i]));
        signature_verifiers[i].generate_r1cs_constraints();
        signature_verifiers[i].generate_r1cs_witness();
    }


    libff::print_header("R1CS GG-ppzkSNARK Generator");

    printf("\n"); libff::print_indent(); libff::print_mem("after generator");

    // private inputs

    // these are the signatures
    // EdDSA signature is a pair (r, s), where r is a point on a curve, and s is an integer



    //dump_keys(pb,"./output")
/*
save keypair via

    vk2json(keypair, vk);
    writeToFile(pk, keypair.pk);

Where vp, pk - file names (string).


*/




    return pb;
}

template<typename ppT, typename HashT>
protoboard<FieldT> compute_proof(const int n, protoboard<FieldT> pb, vector<bool> mm[])
{
    pb_variable<FieldT> median;
    median.allocate(pb, "median");

    std::vector<pb_variable_array<FieldT>> ms(n);
    for (size_t i = 0; i < n; i++) {
        ms[i].allocate(pb, 256, "m_" + i);
        ms[i].fill_with_bits(pb,  mm[i]);
    }

    std::vector<pb_variable<FieldT>> packed_messages(n);
    std::vector<packing_gadget<FieldT>> packers;
    for (size_t i = 0; i < n; i++) {
        packed_messages[i].allocate(pb, "packed_messages_" + i);
        packers.emplace_back(packing_gadget<FieldT>(pb, ms[i], packed_messages[i], "packer_" + i));
        packers[i].generate_r1cs_constraints(false); //TODO: bitness
        packers[i].generate_r1cs_witness_from_bits();
    }
    pb.val(median) = pb.val(packed_messages[0]);

    std::cout << "median = " << pb.val(median) << std::endl;

    pb_variable_array<FieldT> less;
    pb_variable_array<FieldT> less_or_eq;
    less.allocate(pb, n, "less");
    less_or_eq.allocate(pb, n, "less_or_eq");
    std::vector<comparison_gadget<FieldT>> comparators;
    for (size_t i = 0; i < n; i++) {
        comparators.emplace_back(comparison_gadget<FieldT>(pb, FieldT::capacity(), median, packed_messages[i], less[i], less_or_eq[i], "comparator_" + i));
        comparators[i].generate_r1cs_constraints();
        comparators[i].generate_r1cs_witness();
        std::cout << "i = " << i << ", m = " << pb.val(packed_messages[i]) << ", less = " << pb.val(less[i]) << ", less_or_eq = " << pb.val(less_or_eq[i]) << std::endl;
    }

    linear_combination<FieldT> less_or_eq_count = pb_sum<FieldT>(less_or_eq);
    linear_combination<FieldT> more_or_eq_count = n - pb_sum<FieldT>(less);
    pb.add_r1cs_constraint(r1cs_constraint<FieldT>(1, less_or_eq_count, more_or_eq_count), "less_or_eq_count == more_or_eq_count");

    //assert(pb.is_satisfied());

    pb.set_input_sizes(1); // median + a + d + base_x + base_y + n * 256 * 2 // pk_x_bin_
    /*

load keypair.pk and keypair.vk from files

*/
    r1cs_ppzksnark_keypair<ppT> keypair = r1cs_ppzksnark_generator<ppT>(pb.get_constraint_system());

    libff::print_header("R1CS GG-ppzkSNARK Prover");
    r1cs_ppzksnark_proof<ppT> proof = r1cs_ppzksnark_prover<ppT>(keypair.pk, pb.primary_input(), pb.auxiliary_input());
    printf("\n"); libff::print_indent(); libff::print_mem("after prover");

    libff::print_header("Preprocess verification key");
    r1cs_ppzksnark_processed_verification_key<ppT> pvk = r1cs_ppzksnark_verifier_process_vk<ppT>(keypair.vk);

    libff::print_header("R1CS GG-ppzkSNARK Verifier");
    const bool ans = r1cs_ppzksnark_verifier_strong_IC<ppT>(keypair.vk, pb.primary_input(), proof);
    printf("\n"); libff::print_indent(); libff::print_mem("after verifier");
    printf("* The verification result is: %s\n", (ans ? "PASS" : "FAIL"));

    libff::print_header("R1CS GG-ppzkSNARK Online Verifier");
    const bool ans2 = r1cs_ppzksnark_online_verifier_strong_IC<ppT>(pvk, pb.primary_input(), proof);
    //assert(ans == ans2);

    std::cout << pb.num_constraints() << std::endl;

    vk2json(keypair, "keys.json");
    proof_to_json(proof, pb.primary_input());

    return pb;
/*

dump proof to json via
r1cs_primary_input - pb.primary_input() primary input. write it to file
                    pb.auxiliary_input() secret input. do not write it to file

*/
}

std::vector<bool> readVector(std::ifstream& ins) {
    std::vector<bool> result(256);
    for (int i = 0; i < 256; ++i) {
        bool t;
        ins >> t;
        result[i] = t;
    }
    return result;
}


int main () {
    libff::alt_bn128_pp::init_public_params();

    std::ifstream ins("input");

    if (!ins.is_open()) {
        std::cout << "Error opening input file";
        return 1;
    }

    int n;
    int median;
    ins >> n >> median;
    std::vector<bool> pkx[n], pky[n], rx[n], ry[n], s[n], m[n];

    for (int i = 0; i < n; ++i) {
        pkx[i] = readVector(ins);
        pky[i] = readVector(ins);
    }

    for (int i = 0; i < n; ++i) {
        rx[i] = readVector(ins);
        ry[i] = readVector(ins);
        s[i] = readVector(ins);
        m[i] = readVector(ins);
    }



//    vector<bool>   pkx_stub= { 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0 };
//    vector<bool>   pky_stub= { 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0 };
//    vector<bool>   rx_stub = { 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0 };
//    vector<bool>   ry_stub = { 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0 };
//    vector<bool>   ss_stub = { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1 };
//    vector<bool>   mm_stub = { 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0 };


    protoboard<FieldT> snark = trust_setup<libff::alt_bn128_pp, HashT>(n, pkx, pky, rx, ry, s, m);
    protoboard<FieldT> proof = compute_proof<libff::alt_bn128_pp, HashT>(n, snark, m);

    return 0;
}