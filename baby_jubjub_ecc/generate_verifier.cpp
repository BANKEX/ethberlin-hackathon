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



using namespace libsnark;
using namespace libff;
typedef sha256_ethereum HashT;

template<typename ppT>
void tests()
{
    typedef libff::Fr<ppT> FieldT;
    std::shared_ptr<isOnCurve<FieldT>> jubjub_isOnCurve;
    std::shared_ptr<pointAddition<FieldT>> jubjub_pointAddition;
    std::shared_ptr<isOnCurve<FieldT>> jubjub_isOnCurveX3Y3;



    protoboard<FieldT> pb;

    pb_variable<FieldT> x;
    pb_variable<FieldT> y;

    pb_variable<FieldT> x1;
    pb_variable<FieldT> y1;
    pb_variable<FieldT> x2;
    pb_variable<FieldT> y2;
    pb_variable<FieldT> x3;
    pb_variable<FieldT> y3;

    pb_variable<FieldT> x_zero;
    pb_variable<FieldT> y_zero;


    pb_variable<FieldT> a;
    pb_variable<FieldT> d;

    x.allocate(pb, "x");
    y.allocate(pb, "y");

    x1.allocate(pb, "x1");
    y1.allocate(pb, "y1");
    x2.allocate(pb, "x2");
    y2.allocate(pb, "y2");
    x3.allocate(pb, "x3");
    y3.allocate(pb, "y3");


    x_zero.allocate(pb, "x_zero");
    y_zero.allocate(pb, "x_zero");


    a.allocate(pb, "a");
    d.allocate(pb, "d");

    pb.val(x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");
    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb.val(x1) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y1) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");
    pb.val(x2) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y2) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");


    pb.val(x_zero) = FieldT("0");
    pb.val(y_zero) = FieldT("1");



    jubjub_isOnCurve.reset( new isOnCurve <FieldT> (pb, x, y, a, d, "Confirm x, y is on the twiseted edwards curve"));
    jubjub_pointAddition.reset( new pointAddition <FieldT> (pb, a, d, x1, y1 , x2 , y2, x3, y3 , "x1, y1 + x2 , y2"));
    jubjub_isOnCurveX3Y3.reset( new isOnCurve <FieldT> (pb, x3, y3, a, d, "confirm x3, y3 is on the curve"));

    jubjub_isOnCurve->generate_r1cs_constraints();
    jubjub_pointAddition->generate_r1cs_constraints();
    jubjub_isOnCurveX3Y3->generate_r1cs_constraints();

    //check that the generator point is on the twisted edwards curve
    jubjub_isOnCurve->generate_r1cs_witness();
    jubjub_pointAddition->generate_r1cs_witness();
    jubjub_isOnCurveX3Y3->generate_r1cs_witness();



    //check the addition
    assert(FieldT("6890855772600357754907169075114257697580319025794532037257385534741338397365") == pb.lc_val(x3));
    assert(FieldT("4338620300185947561074059802482547481416142213883829469920100239455078257889") == pb.lc_val(y3));

    assert(pb.is_satisfied());

}

template<typename ppT> 
void test_pointAddition () { 
    typedef libff::Fr<ppT> FieldT;

    std::shared_ptr<pointAddition<FieldT>> jubjub_pointAddition;

    protoboard<FieldT> pb;

    pb_variable<FieldT> x;
    pb_variable<FieldT> y;

    pb_variable<FieldT> x1;
    pb_variable<FieldT> y1;
    pb_variable<FieldT> x2;
    pb_variable<FieldT> y2;
    pb_variable<FieldT> x3;
    pb_variable<FieldT> y3;

    pb_variable<FieldT> x_zero;
    pb_variable<FieldT> y_zero;


    pb_variable<FieldT> a;
    pb_variable<FieldT> d;

    x.allocate(pb, "x");
    y.allocate(pb, "y");

    x1.allocate(pb, "x1");
    y1.allocate(pb, "y1");
    x2.allocate(pb, "x2");
    y2.allocate(pb, "y2");
    x3.allocate(pb, "x3");
    y3.allocate(pb, "y3");


    x_zero.allocate(pb, "x_zero");
    y_zero.allocate(pb, "x_zero");


    a.allocate(pb, "a");
    d.allocate(pb, "d");

    pb.val(x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");
    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb.val(x1) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y1) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");
    pb.val(x2) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y2) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");


    pb.val(x_zero) = FieldT("0");
    pb.val(y_zero) = FieldT("1");


    jubjub_pointAddition.reset( new pointAddition <FieldT> (pb, a, d, x1, y1 , x2 , y2, x3, y3 , "x1, y1 + x2 , y2"));
    jubjub_pointAddition->generate_r1cs_constraints();
    jubjub_pointAddition->generate_r1cs_witness();

    //check the addition
    assert(FieldT("6890855772600357754907169075114257697580319025794532037257385534741338397365") == pb.lc_val(x3));
    assert(FieldT("4338620300185947561074059802482547481416142213883829469920100239455078257889") == pb.lc_val(y3));

    // check the multiplication
    //assert(FieldT("0") == pb.lc_val(x_zero));
    //assert(FieldT("1") == pb.lc_val(y_zero));

    //std::cout << pb.lc_val(x_ret[1]) << " output " << pb.lc_val(y_ret[1]) << std::endl;

    //std::cout << "point addition " << pb.num_constraints() << " constraints" << std::endl;

    assert(pb.is_satisfied());
    //std::cout << pb.is_satisfied() << "\n";
}

template<typename ppT>
void test_conditional_addition() { 
    typedef libff::Fr<ppT> FieldT;
    std::shared_ptr<conditionalPointAddition<FieldT>> jubjub_conditionalPointAddition;
    std::shared_ptr<conditionalPointAddition<FieldT>> jubjub_conditionalPointAddition1;

    protoboard<FieldT> pb;

    pb_variable<FieldT> x;
    pb_variable<FieldT> y;

    pb_variable<FieldT> x_zero;
    pb_variable<FieldT> y_zero;

    pb_variable<FieldT> a;
    pb_variable<FieldT> d;


    x.allocate(pb, "x");
    y.allocate(pb, "y");

    x_zero.allocate(pb, "x_zero");
    y_zero.allocate(pb, "x_zero");


    a.allocate(pb, "a");
    d.allocate(pb, "d");

    pb.val(x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");

    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb_variable_array<FieldT> coef;
    pb_variable_array<FieldT> x_ret;
    pb_variable_array<FieldT> y_ret;

    coef.allocate(pb, 253, FMT("annotation_prefix", " scaler to multiply by"));
    x_ret.allocate(pb, 253+1, FMT("annotation_prefix", " x res"));
    y_ret.allocate(pb, 253+1, FMT("annotation_prefix", " y res"));


    pb.val(coef[0]) = FieldT(1);
    pb.val(coef[1]) = FieldT(0);

    //this->add[0].reset( new conditionalPointAddition <FieldT> (this->pb, a, d, x_zero, y_zero , x_zero, y_zero, x_ret[1], y_ret[1], coef[0], "x1, y1 + x2 , y2"));

    jubjub_conditionalPointAddition.reset( new conditionalPointAddition <FieldT> (pb, a, d, x, y, x, y ,x_ret[0], y_ret[0],coef[0], " "));
    jubjub_conditionalPointAddition->generate_r1cs_constraints();
    jubjub_conditionalPointAddition->generate_r1cs_witness();



    jubjub_conditionalPointAddition.reset( new conditionalPointAddition <FieldT> (pb, a, d, x, y, x, y ,x_ret[1], y_ret[1],coef[1], " "));
    jubjub_conditionalPointAddition->generate_r1cs_constraints();
    jubjub_conditionalPointAddition->generate_r1cs_witness();

    //check the addition
    assert(FieldT("6890855772600357754907169075114257697580319025794532037257385534741338397365") == pb.lc_val(x_ret[0]));
    assert(FieldT("4338620300185947561074059802482547481416142213883829469920100239455078257889") == pb.lc_val(y_ret[0]));
    assert(FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268") == pb.lc_val(x_ret[1]));
    assert(FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475") == pb.lc_val(y_ret[1]));
    assert(pb.is_satisfied());


}


template<typename ppT>
void test_pointMultiplication() {
    typedef libff::Fr<ppT> FieldT;
    std::shared_ptr<pointMultiplication<FieldT>> jubjub_pointMultiplication;
    protoboard<FieldT> pb;

    pb_variable<FieldT> x;
    pb_variable<FieldT> y;

    pb_variable<FieldT> a;
    pb_variable<FieldT> d;


    x.allocate(pb, "x");
    y.allocate(pb, "y");

    a.allocate(pb, "a");
    d.allocate(pb, "d");

    pb.val(x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");

    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb_variable_array<FieldT> coef;


    pb_variable_array<FieldT> x_ret;
    pb_variable_array<FieldT> y_ret;



    x_ret.allocate(pb, 253, FMT("annotation_prefix", " x return"));
    y_ret.allocate(pb, 253, FMT("annotation_prefix", " y return"));

    coef.allocate(pb, 253, FMT("annotation_prefix", " scaler to multiply by"));

    coef.fill_with_bits(pb, {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 , 1, 1, 1, 1});

    jubjub_pointMultiplication.reset( new pointMultiplication <FieldT> (pb, a, d, x, y, coef,x_ret, y_ret, " ", 253));
    jubjub_pointMultiplication->generate_r1cs_constraints();
    jubjub_pointMultiplication->generate_r1cs_witness();


    //debug
    /*
    for (uint i = 0 ; i < 255 ; i++) {
         std::cout << pb.lc_val(x_ret[i]) << " output " << pb.lc_val(y_ret[i]) << std::endl;
    }*/


    assert(FieldT("19372461775513343691590086534037741906533799473648040012278229434133483800898") == pb.lc_val(x_ret[249]));
    assert(FieldT("9458658722007214007257525444427903161243386465067105737478306991484593958249") == pb.lc_val(y_ret[249]));

    //check 7, 111 in bianry
    assert(FieldT("2323860911332798975737225840038489818948922802448566828157080989954871830560") == pb.lc_val(x_ret[250]));
    assert(FieldT("19716335860170617342854600407491621598417915846079864794713717598030286960291") == pb.lc_val(y_ret[250]));

    // check 15 , 1111 in binary 

    assert(FieldT("9407276749418864625568650125865534168179830182005426556252343362174020878457") == pb.lc_val(x_ret[251])); 
    assert(FieldT("6778521764145897584820260810756236306135110983984768137378792002317567424624") == pb.lc_val(y_ret[251]));

    // check 31 , 11111 in binary 

    assert(FieldT("7622845806798279333008973964667360626508482363013971390840869953521351129788") == pb.lc_val(x_ret[252]));
    assert(FieldT("120664075238337199387162984796177147820973068364675632137645760787230319545") == pb.lc_val(y_ret[252]));

    std::cout << pb.is_satisfied();
}

template<typename ppT>
void test_pointMultiplication2() {
    typedef libff::Fr<ppT> FieldT;
    std::shared_ptr<pointMultiplication<FieldT>> jubjub_pointMultiplication;
    protoboard<FieldT> pb;

    pb_variable<FieldT> x;
    pb_variable<FieldT> y;

    pb_variable<FieldT> a;
    pb_variable<FieldT> d;


    x.allocate(pb, "x");
    y.allocate(pb, "y");

    a.allocate(pb, "a");
    d.allocate(pb, "d");

    pb.val(x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");

    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb_variable_array<FieldT> coef;

    pb_variable_array<FieldT> x_ret;
    pb_variable_array<FieldT> y_ret;

    x_ret.allocate(pb, 253, FMT("annotation_prefix", " x return"));
    y_ret.allocate(pb, 253, FMT("annotation_prefix", " y return"));
    // todo convert to 253 -> 253
    coef.allocate(pb, 253, FMT("annotation_prefix", " scaler to multiply by"));


    coef.fill_with_bits(pb, {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1});

    jubjub_pointMultiplication.reset( new pointMultiplication <FieldT> (pb, a, d, x, y, coef,x_ret, y_ret, " ", 253));
    jubjub_pointMultiplication->generate_r1cs_constraints();
    jubjub_pointMultiplication->generate_r1cs_witness();

    assert(FieldT("14301684958125943009122272922675861319630543242194947245351673046543952469619") == pb.lc_val(x_ret[252]));
    assert(FieldT("11800725617493155580803527033124862356775833708153925911126323435989069641481") == pb.lc_val(y_ret[252]));
    std::cout << pb.is_satisfied();
    //std::cout << "point multiplicaion " << pb.num_constraints() <<  " constraints, " << pb.num_constraints() / 253 << " constarints per bit " << std::endl;
}
// test inputs taken from ../test/test_eddsa.py
template<typename ppT, typename HashT>
void test_eddsa2() {
    int[] pkx_stub={ 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0 };
    int[] pky_stub={ 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0 };
        
    int[] ss_stub={ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1 };
    int[] ms_stub={ 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0 };
    typedef libff::Fr<ppT> FieldT;

    protoboard<FieldT> pb;

    // public inputs first

    pb_variable<FieldT> median;
    median.allocate(pb, "median");

    // domain specification
    // see https://github.com/barryWhiteHat/baby_jubjub for the values
    pb_variable<FieldT> a;
    pb_variable<FieldT> d;
    a.allocate(pb, "a");
    d.allocate(pb, "d");
    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb_variable<FieldT> base_x;
    pb_variable<FieldT> base_y;
    base_x.allocate(pb, "base x");
    base_y.allocate(pb, "base y");
    pb.val(base_x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(base_y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");

    const size_t n = 1;
    assert(n % 2 == 1);

    // these are public keys,
    // EdDSA public key is a point on a curve
//    pb_variable_array<FieldT> pk_x_bin;
//    pb_variable_array<FieldT> pk_y_bin;
//    pk_x_bin.allocate(pb, 256, "pk_x_bin");
//    pk_y_bin.allocate(pb, 256, "pk_y_bin");
//    pk_x_bin.fill_with_bits(pb, { 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0 });
//    pk_y_bin.fill_with_bits(pb, { 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0 });

    std::vector<pb_variable_array<FieldT>> pk_x_bins(n);
    std::vector<pb_variable_array<FieldT>> pk_y_bins(n);
    for (size_t i = 0; i < n; i++) {
        pk_x_bins[i].allocate(pb, 256, "pk_x_bin_" + i);
        pk_y_bins[i].allocate(pb, 256, "pk_y_bin_" + i);

        pk_x_bins[i].fill_with_bits(pb, pkx_stub);
        pk_y_bins[i].fill_with_bits(pb, pky_stub);
    }

    // private inputs

    // these are the signatures
    // EdDSA signature is a pair (r, s), where r is a point on a curve, and s is an integer
//    pb_variable_array<FieldT> r_x_bin;
//    pb_variable_array<FieldT> r_y_bin;
//    r_x_bin.allocate(pb, 256, "r_x_bin");
//    r_y_bin.allocate(pb, 256, "r_y_bin");
//    r_x_bin.fill_with_bits(pb, { 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0 });
//    r_y_bin.fill_with_bits(pb, { 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0 });

    std::vector<pb_variable_array<FieldT>> r_x_bins(n);
    std::vector<pb_variable_array<FieldT>> r_y_bins(n);
    std::vector<pb_variable_array<FieldT>> ss(n);
    std::vector<pb_variable_array<FieldT>> ms(n);
    for (size_t i = 0; i < n; i++) {
        r_x_bins[i].allocate(pb, 256, "r_x_bin_" + i);
        r_y_bins[i].allocate(pb, 256, "r_y_bin_" + i);
        r_x_bins[i].fill_with_bits(pb, { 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0 });
        r_y_bins[i].fill_with_bits(pb, { 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0 });

        ss[i].allocate(pb, 256, "s_" + i);
        ss[i].fill_with_bits(pb,  ss_stub);

        ms[i].allocate(pb, 256, "m_" + i);
        ms[i].fill_with_bits(pb,  ms_stub);
    }

//    pb_variable_array<FieldT> s;
//    s.allocate(pb, 256, "s");
//    s.fill_with_bits(pb,  { 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1 });
//
//    pb_variable_array<FieldT> m;
//    m.allocate(pb, 256, "m");
//    m.fill_with_bits(pb,  { 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0 });

//    eddsa<FieldT, HashT> signature_verifier(pb, a, d, pk_x_bin, pk_y_bin, base_x, base_y, r_x_bin, r_y_bin, m, s);
//    signature_verifier.generate_r1cs_constraints();
//    signature_verifier.generate_r1cs_witness();

    std::vector<eddsa<FieldT, HashT>> signature_verifiers;
    for (size_t i = 0; i < n; i++) {
        signature_verifiers.emplace_back(eddsa<FieldT, HashT>(pb, a, d, pk_x_bins[i], pk_y_bins[i], base_x, base_y, r_x_bins[i], r_y_bins[i], ms[i], ss[i]));
        signature_verifiers[i].generate_r1cs_constraints();
        signature_verifiers[i].generate_r1cs_witness();
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

//    packing_gadget<FieldT> packer(pb, ms[0], result, "packer");
//    packer.generate_r1cs_constraints(false); //TODO: bitness
//    packer.generate_r1cs_witness_from_bits();

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

    assert(pb.is_satisfied());

    pb.set_input_sizes(5 + 2 * n * 256); // median + a + d + base_x + base_y + n * 256 * 2 // pk_x_bin_

    libff::print_header("R1CS GG-ppzkSNARK Generator");
    r1cs_ppzksnark_keypair<ppT> keypair = r1cs_ppzksnark_generator<ppT>(pb.get_constraint_system());
    printf("\n"); libff::print_indent(); libff::print_mem("after generator");

    libff::print_header("Preprocess verification key");
    r1cs_ppzksnark_processed_verification_key<ppT> pvk = r1cs_ppzksnark_verifier_process_vk<ppT>(keypair.vk);

    libff::print_header("R1CS GG-ppzkSNARK Prover");
    r1cs_ppzksnark_proof<ppT> proof = r1cs_ppzksnark_prover<ppT>(keypair.pk, pb.primary_input(), pb.auxiliary_input());
    printf("\n"); libff::print_indent(); libff::print_mem("after prover");

    libff::print_header("R1CS GG-ppzkSNARK Verifier");
    const bool ans = r1cs_ppzksnark_verifier_strong_IC<ppT>(keypair.vk, pb.primary_input(), proof);
    printf("\n"); libff::print_indent(); libff::print_mem("after verifier");
    printf("* The verification result is: %s\n", (ans ? "PASS" : "FAIL"));

    libff::print_header("R1CS GG-ppzkSNARK Online Verifier");
    const bool ans2 = r1cs_ppzksnark_online_verifier_strong_IC<ppT>(pvk, pb.primary_input(), proof);
    assert(ans == ans2);
    
    std::cout << pb.num_constraints() << std::endl;
}
// test inputs taken from ../test/test_pedersen.py
template<typename ppT>
void test_pedersen() {
    typedef libff::Fr<ppT> FieldT;
    protoboard<FieldT> pb;
    std::shared_ptr<pedersen_commitment<FieldT>> jubjub_pedersen_commitment;

    pb_variable<FieldT> base_x;
    pb_variable<FieldT> base_y;

    pb_variable<FieldT> a;
    pb_variable<FieldT> d;
    //public key
    pb_variable<FieldT> h_x;
    pb_variable<FieldT> h_y;

    pb_variable<FieldT> commitment_x;
    pb_variable<FieldT> commitment_y;


    base_x.allocate(pb, "base x");
    base_y.allocate(pb, "base y");

    h_x.allocate(pb, "h_x");
    h_y.allocate(pb, "h_y");


    a.allocate(pb, "a");
    d.allocate(pb, "d");

    commitment_x.allocate(pb, "r_x");
    commitment_y.allocate(pb, "r_y");





    pb.val(base_x) = FieldT("17777552123799933955779906779655732241715742912184938656739573121738514868268");
    pb.val(base_y) = FieldT("2626589144620713026669568689430873010625803728049924121243784502389097019475");

    pb.val(a) = FieldT("168700");
    pb.val(d) = FieldT("168696");

    pb.val(h_x) = FieldT("16540640123574156134436876038791482806971768689494387082833631921987005038935");
    pb.val(h_y) = FieldT("20819045374670962167435360035096875258406992893633759881276124905556507972311");


    pb.val(commitment_x) = FieldT("8010604480252997578874361183087746053332521656016812693508547791817401879458");
    pb.val(commitment_y) = FieldT("15523586168823793714775329447481371860621135473088351041443641753333446779329");


    pb_variable_array<FieldT> m;
    pb_variable_array<FieldT> r;

    m.allocate(pb, 256, FMT("annotation_prefix", " scaler to multiply by"));

    r.allocate(pb, 256, FMT("annotation_prefix", " scaler to multiply by"));
   
 
    m.fill_with_bits(pb,  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1});

    r.fill_with_bits(pb, {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1});


    jubjub_pedersen_commitment.reset(new pedersen_commitment<FieldT> (pb,a,d, base_x, base_y, h_x, h_y,commitment_x, commitment_y,m, r));
    jubjub_pedersen_commitment->generate_r1cs_constraints();
    jubjub_pedersen_commitment->generate_r1cs_witness();
    assert(pb.is_satisfied());

}




int main () {
    libff::alt_bn128_pp::init_public_params();

    //test_conditional_addition<libff::alt_bn128_pp>();
    //test_pointAddition<libff::alt_bn128_pp>();
    //test_pointMultiplication<libff::alt_bn128_pp>();
    //test_pointMultiplication2<libff::alt_bn128_pp>();


    test_eddsa2<libff::alt_bn128_pp, HashT>();
    //test_pedersen<libff::alt_bn128_pp>();

    return 0;
}
