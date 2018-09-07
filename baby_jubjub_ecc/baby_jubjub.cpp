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


#include <libff/common/profiling.hpp>
#include <libff/common/utils.hpp>

using namespace libff;
typedef bigint<alt_bn128_r_limbs> bigint_r;

namespace libsnark {


template<typename FieldT>
isOnCurve<FieldT>::isOnCurve(protoboard<FieldT> &pb,
                   /*const pb_linear_combination_array<FieldT> &bits,*/
                   const pb_variable<FieldT> &x, const pb_variable<FieldT> &y,
                   const pb_variable<FieldT> &a, const pb_variable<FieldT> &d,
                   const std::string &annotation_prefix):
        gadget<FieldT>(pb, annotation_prefix) , x(x), y(y), a(a), d(d) 
{
    xx.allocate(this->pb, "xx");
    yy.allocate(this->pb, "yy");
    dxx.allocate(this->pb, "dxx");
    axx.allocate(this->pb, "axx");
    dxxyy.allocate(this->pb, "dxxyy");
    lhs.allocate(this->pb, "lhs");
    rhs.allocate(this->pb, "rhs");
 

}



template<typename FieldT>
void isOnCurve<FieldT>::generate_r1cs_constraints()
{
    // checks that a*x*x + y*y = 1 + d*x*x*y*y
    // where x , y are curve points
    // and a , d are curve parameters.

    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({x} , {x}, {xx}),
                           FMT("find x*x", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({y} , {y}, {yy}),
                           FMT("find y*y", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({a} , {xx}, {axx}),
                           FMT( annotation_prefix, "find a*x*x"));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({axx, yy} , {1}, {lhs}),
                           FMT("find lhs", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({d} , {xx}, {dxx}),
                           FMT("find dxx", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({dxx} , {yy}, {dxxyy}),
                           FMT("find rhs", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({dxxyy , 1} , {1}, {rhs}),
                           FMT("find rhs", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({lhs} , {1}, {rhs}),
                           FMT("lhs == rhs", ""));
}


template<typename FieldT>
void isOnCurve<FieldT>::generate_r1cs_witness()
{
    //linear_combination<FieldT> lc; 


    FieldT _x = this->pb.lc_val(this->x);
    FieldT _y = this->pb.lc_val(this->y);
    FieldT _a = this->pb.lc_val(this->a);
    FieldT _d = this->pb.lc_val(this->d);

    this->pb.val(x) = FieldT(_x); 
    this->pb.val(y) = FieldT(_y);
    this->pb.val(a) = FieldT(_a);
    this->pb.val(d) = FieldT(_d);

    this->pb.val(xx) = FieldT(_x*_x);
    this->pb.val(yy) = FieldT(_y*_y);
    this->pb.val(axx) = FieldT(_a*_x*_x);
    this->pb.val(lhs) = FieldT(_a*_x*_x + _y*_y);
    this->pb.val(dxx) = FieldT(_x*_x*_d);
    this->pb.val(dxxyy) = FieldT(_d*_x*_x*_y*_y);

    this->pb.val(rhs) = FieldT(_d*_x*_x*_y*_y + 1); 
}

template<typename FieldT>
pointAddition<FieldT>::pointAddition(protoboard<FieldT> &pb,
                   /*const pb_linear_combination_array<FieldT> &bits,*/
                   const pb_variable<FieldT> &a, const pb_variable<FieldT> &d,
                   const pb_variable<FieldT> &x1, const pb_variable<FieldT> &y1,
                   const pb_variable<FieldT> &x2, const pb_variable<FieldT> &y2,
                   const pb_variable<FieldT> &x3, const pb_variable<FieldT> &y3,

                   const std::string &annotation_prefix):
        gadget<FieldT>(pb, annotation_prefix) , a(a), d(d) , x1(x1), y1(y1), x2(x2), y2(y2), x3(x3), y3(y3)
{


    jubjub_isOnCurve.reset( new isOnCurve <FieldT> (this->pb, x3, y3, a, d, "modulo"));
    x1x2.allocate(this->pb, "x1x2");
    x1y2.allocate(this->pb, "x1y2");
    y1y2.allocate(this->pb, "y1y2");
    y1x2.allocate(this->pb, "y1x2");
    x1x2y1y2.allocate(this->pb, "x1x2y1y2");
    dx1x2y1y2.allocate(this->pb, "dx1x2y1y2");
    ax1x2.allocate(this->pb, "ax1x2");
}



template<typename FieldT>
void pointAddition<FieldT>::generate_r1cs_constraints()
{
    // checks that   
    //  x3 = (x1*y2 + y1*x2) / (Fq.ONE + JUBJUB_D*x1*x2*y1*y2)
    //  y3 = (y1*y2 - JUBJUB_A*x1*x2) / (Fq.ONE - JUBJUB_D*x1*x2*y1*y2)
  
    // where x , y are curve points
    // and a , d are curve parameters.
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({y1} , {x2}, {y1x2}),
                           FMT("find y1*x2 == y1x2", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({x1} , {y2}, {x1y2}),
                           FMT("find x1y2 == x1y2", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({x1} , {x2}, {x1x2}),
                           FMT("x1*x2 == x1x2", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({y1} , {y2}, {y1y2}),
                           FMT(annotation_prefix, "find y1*y2= y1y2"));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({x1x2} , {y1y2}, {x1x2y1y2}),
                           FMT("find lhs", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({d} , {x1x2y1y2}, {dx1x2y1y2}),
                           FMT("confirm dx1x2y1y2", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({a} , {x1x2}, {ax1x2}),
                           FMT("confirm ax1x2", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({y3} , {1, -dx1x2y1y2}  ,  {y1y2 , -ax1x2}),
                           FMT("confirm y3", ""));
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({x3} , {1, dx1x2y1y2}, {x1y2, y1x2}),
                           FMT("confirm x3", ""));



    //jubjub_isOnCurve->generate_r1cs_constraints();
}


template<typename FieldT>
void pointAddition<FieldT>::generate_r1cs_witness()
{
    //linear_combination<FieldT> lc; 

    FieldT _x1 = this->pb.lc_val(this->x1); 
    FieldT _y1 = this->pb.lc_val(this->y1); 
    FieldT _x2 = this->pb.lc_val(this->x2);
    FieldT _y2 = this->pb.lc_val(this->y2);
    FieldT _a = this->pb.lc_val(this->a);
    FieldT _d = this->pb.lc_val(this->d);


    this->pb.val(x1x2) = FieldT(_x1*_x2);
    this->pb.val(x1y2) = FieldT(_x1*_y2);
    this->pb.val(y1y2) = FieldT(_y1*_y2);
    this->pb.val(y1x2) = FieldT(_y1*_x2);
    this->pb.val(x1x2y1y2) = FieldT(_x1*_x2*_y1*_y2);
    this->pb.val(dx1x2y1y2) = FieldT(_d*_x1*_x2*_y1*_y2);
    this->pb.val(ax1x2) = FieldT(_a*_x1*_x2);


    /* 
    //DEBUG
    std::cout << " x3     "  << _d <<  " " << _y1 << " " << _y2 << " " << _x1 << " " << _x2 << " " <<  " " << (FieldT(1) - (_d*_x1*_x2*_y1*_y2))  << std::endl ;
    std::cout <<"  lhs    " << FieldT(_x1*_y2 + _y1*_x2) << std::endl;
    std::cout <<"  rhs    " << FieldT((FieldT(1) +  (_d*_x1*_x2*_y1*_y2)).inverse()) << std::endl;
    std::cout <<"  x3    " << FieldT(_x1*_y2 + _y1*_x2) * FieldT((FieldT(1) +  (_d*_x1*_x2*_y1*_y2)).inverse()) << std::endl;
    std::cout << FieldT(_x1*_y2 + _y1*_x2) * FieldT((FieldT(1) +  (_d*_x1*_x2*_y1*_y2)).inverse()) * FieldT((FieldT(1) +  (_d*_x1*_x2*_y1*_y2))) << std::endl;
    */  

    this->pb.val(x3) = FieldT(_x1*_y2 + _y1*_x2) * FieldT((FieldT(1) +  (_d*_x1*_x2*_y1*_y2)).inverse()); 
    this->pb.val(y3) = FieldT(_y1*_y2 - _a*_x1*_x2) * FieldT((FieldT(1) -  (_d*_x1*_x2*_y1*_y2)).inverse());

    //jubjub_isOnCurve->generate_r1cs_witness(x3, y3, &_a_str[0u] , &_d_str[0u]);



}

template<typename FieldT>
conditionalPointAddition<FieldT>::conditionalPointAddition(protoboard<FieldT> &pb,
                   /*const pb_linear_combination_array<FieldT> &bits,*/
                   const pb_variable<FieldT> &a, const pb_variable<FieldT> &d,
                   const pb_variable<FieldT> &x1, const pb_variable<FieldT> &y1,
                   const pb_variable<FieldT> &x2, const pb_variable<FieldT> &y2,
                   const pb_variable<FieldT> &x3, const pb_variable<FieldT> &y3,
                   const pb_variable<FieldT> &canAdd, const std::string &_annotation_prefix):
        gadget<FieldT>(pb, _annotation_prefix) , a(a), d(d) , x1(x1), y1(y1), x2(x2), y2(y2), x3(x3), y3(y3), canAdd(canAdd)
{

      
    x_toAdd.allocate(this->pb, "x_toAdd");
    y_toAdd.allocate(this->pb, "y_toAdd");

    y_intermediate_toAdd1.allocate(this->pb, "y_intermatied_toAdd1");
    y_intermediate_toAdd2.allocate(this->pb, "y_intermatied_toAdd2");

    not_canAdd.allocate(this->pb, "not_canAdd");

    jubjub_pointAddition.reset( new pointAddition <FieldT> (this->pb, a, d, x1, y1, x_toAdd , y_toAdd , x3, y3, "x1, y1 + x2 , y2"));

}



template<typename FieldT>
void conditionalPointAddition<FieldT>::generate_r1cs_constraints()
{
    // if coef == 1 then x_ret[i] + x_base 
    //x_add[i] = coef[i] * x_base;
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({x2} , {canAdd}, {x_toAdd}),
                           FMT("add 0 if coef == 0 else x_base", ""));

    // else do nothing. Ie add the zero point (0, 1)
    //y_add[i] = coef[i] * y_base + !coef[i];    
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({y2} , {canAdd}, {y_intermediate_toAdd1}),
                          FMT("add 1 if coef == 0 else y_base", ""));
    
    //not coef
    // make sure canAdd == 0 or canAdd == 1
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>(canAdd, 1-canAdd, 0),
                           FMT(annotation_prefix, " boolean_r1cs_constraint canAdd"));
     // make sure not_canAdd == 0 or not_canAdd == 1
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>(not_canAdd, 1-not_canAdd, 0),
                           FMT(annotation_prefix, " boolean_r1cs_constraint not_canAdd"));
    // make sure that the sum of canAdd, not_canAdd == 1 which means canAdd!=not_canAdd
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({not_canAdd, canAdd}, {1}, {1}),
                           FMT(annotation_prefix, " not_canAdd == ! canAdd"));

    // because the are bool and because they are not equal we know that the inverse of one
    // is the other. 

    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({not_canAdd} , {1}, {y_intermediate_toAdd2}),
                          FMT("add 0 if coef == 0 else x_base", ""));

    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>({y_intermediate_toAdd1, y_intermediate_toAdd2} , {1}, {y_toAdd}),
                          FMT("add 1 if coef == 0 else y_base", ""));
    // do the addition of either y1 , y1 plus x2, y2 if canAdd == true else x1 , y1 + 0
    jubjub_pointAddition->generate_r1cs_constraints();    
}


template<typename FieldT>
void conditionalPointAddition<FieldT>::generate_r1cs_witness()
{   
    this->pb.val(x_toAdd) = this->pb.lc_val(this->x2) * this->pb.lc_val(this->canAdd);
    this->pb.val(this->y_intermediate_toAdd1) = this->pb.lc_val(this->y2) * this->pb.lc_val(this->canAdd);

    if (this->pb.lc_val(this->canAdd) == 1) {
        this->pb.val(this->not_canAdd) = FieldT(0);
        this->pb.val(this->y_intermediate_toAdd2) = this->pb.lc_val(this->not_canAdd) * FieldT(1);
        this->pb.val(this->y_toAdd) = FieldT(this->pb.lc_val(this->y_intermediate_toAdd1));
    } else {
        this->pb.val(this->not_canAdd) = FieldT(1);
        this->pb.val(this->y_intermediate_toAdd2) = this->pb.lc_val(this->not_canAdd) * FieldT(1);
        this->pb.val(this->y_toAdd) = FieldT(1);//this->pb.lc_val(this->y_intermediate_toAdd2));
    }
    jubjub_pointAddition->generate_r1cs_witness();  

}



template<typename FieldT>
pointMultiplication<FieldT>::pointMultiplication(protoboard<FieldT> &pb,
                   /*const pb_linear_combination_array<FieldT> &bits,*/
                   const pb_variable<FieldT> &a, const pb_variable<FieldT> &d,
                   const pb_variable<FieldT> &x, const pb_variable<FieldT> &y,
                   const pb_variable_array<FieldT> &coef, const pb_variable_array<FieldT> x_ret, 
                   const pb_variable_array<FieldT> y_ret, const std::string &annotation_prefix, 
                   int coef_size):
        gadget<FieldT>(pb, annotation_prefix) , a(a), d(d) , x(x), y(y), coef(coef), x_ret(x_ret), y_ret(y_ret), coef_size(coef_size)
{

    //performs point multiplicaion using double and add method
    this->doub.resize(coef_size);
    this->add.resize(coef_size);

    x_zero.allocate(pb, "x_zero");
    y_zero.allocate(pb, "y_zero");

    x_intermediary.allocate(pb, coef_size, FMT("annotation_prefix", " x intermediary"));
    y_intermediary.allocate(pb, coef_size, FMT("annotation_prefix", " y intermediary"));

    pb.val(x_zero) = FieldT("0");
    pb.val(y_zero) = FieldT("1");

    this->doub[0].reset( new pointAddition <FieldT> (this->pb, a, d, x_zero, y_zero , x_zero , y_zero, x_intermediary[0], y_intermediary[0], "x1, y1 + x2 , y2"));
    this->add[0].reset( new conditionalPointAddition <FieldT> (this->pb, a, d, x_intermediary[0], y_intermediary[0] , x, y, x_ret[0], y_ret[0], coef[0], "x1, y1 + x2 , y2"));
    //boolean constrain coef[0]
    this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>(coef[0], 1-coef[0], 0),
                           FMT(annotation_prefix, " boolean_r1cs_constraint canAdd"));

    for(uint i=1; i<coef_size; i++) { 
        //boolean constarin coef[i]       
        this->pb.add_r1cs_constraint(r1cs_constraint<FieldT>(coef[i], 1-coef[i], 0),
                       FMT(annotation_prefix, " boolean_r1cs_constraint canAdd"));
        //double
        this->doub[i].reset( new pointAddition <FieldT> (this->pb, a, d, x_ret[i-1], y_ret[i-1] , x_ret[i-1] , y_ret[i-1], x_intermediary[i], y_intermediary[i], "x1, y1 + x2 , y2"));
        //add
        this->add[i].reset( new conditionalPointAddition <FieldT> (this->pb, a, d, x_intermediary[i], y_intermediary[i] , x, y, x_ret[i], y_ret[i], coef[i], "x1, y1 + x2 , y2"));
    }
}

template<typename FieldT>
void pointMultiplication<FieldT>::generate_r1cs_constraints()
{
    for(uint i=0; i<coef_size; i++) {

       this->doub[i]->generate_r1cs_constraints();
       this->add[i]->generate_r1cs_constraints();   
    }
}

template<typename FieldT>
void pointMultiplication<FieldT>::generate_r1cs_witness()
{
    for(uint i=0; i<coef_size; i++) {
        this->doub[i]->generate_r1cs_witness();
        this->add[i]->generate_r1cs_witness();
        /*
        //debug
        std::cout << i << " i  " << this->pb.lc_val(coef[i]) << std::endl;
        std::cout << this->pb.lc_val(x_ret[i]) << " output " << this->pb.lc_val(y_ret[i]) << std::endl;
        std::cout << this->pb.lc_val(x_intermediary[i]) << " intermediary " << this->pb.lc_val(y_intermediary[i]) << std::endl;
        */
    }
}



} // libsnark
