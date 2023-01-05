/* Formatted on 2022-06-28 ¿ÀÀü 10:52:56 (QP5 v5.215.12089.38647) */
SELECT SLIP_CLS,
       SLIP_DATE,
       SLIP_NO,
       SLIP_SEQ,
       SLIP_SORT,
       ACCOUNT_DATE,
       SLIP_KIND,
       GRP_CD,
       DTL_CD,
       CUST_CD,
       DEB_AMOUNT,
       CRE_AMOUNT,
       ORGANIZATION_CODE,
       EMPLOYEE_KEY
       
  FROM HAEUN.AC_SLIP
  
  where slip_date between "20220101" and "20220131" ;

  
  
select grp_cd, dtl_cd, sum(deb_amount)
from haeun.ac_slip
group by grp_cd, dtl_cd ;
