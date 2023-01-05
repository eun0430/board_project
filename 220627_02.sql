INSERT INTO HAEUN.AC_CODE_GRP (
   GRP_CD, GRP_NM, AC_LEVEL, 
   DC_CLS, PARENT_CD1, PARENT_CD2, 
   PARENT_CD3, PARENT_CD4) 
VALUES (
    '1000',
    '자산',
    '1',
    '1',
    '1000',
    null,
    null,
    null );
    
INSERT INTO HAEUN.AC_CODE_GRP (
   GRP_CD, GRP_NM, AC_LEVEL, 
   DC_CLS, PARENT_CD1, PARENT_CD2, 
   PARENT_CD3, PARENT_CD4) 
VALUES (
    '1100',
    '유동자산', 
    '2',
    '1',
    '1000',
    null,
    null,
    null );
    
INSERT INTO HAEUN.AC_CODE_GRP (
   GRP_CD, GRP_NM, AC_LEVEL, 
   DC_CLS, PARENT_CD1, PARENT_CD2, 
   PARENT_CD3, PARENT_CD4) 
VALUES (
    '1200',
    '당좌자산',
    '3',
    '1',
    '1000',
    '1100',
    null,
    null );
    
INSERT INTO HAEUN.AC_CODE_GRP (
   GRP_CD, GRP_NM, AC_LEVEL, 
   DC_CLS, PARENT_CD1, PARENT_CD2, 
   PARENT_CD3, PARENT_CD4) 
VALUES (
    '1210',
    '현금및견금성자산',
    '4',
    '1',
    '1000',
    '1100',
    '1200',
    null );
    
INSERT INTO HAEUN.AC_CODE_GRP (
   GRP_CD, GRP_NM, AC_LEVEL, 
   DC_CLS, PARENT_CD1, PARENT_CD2, 
   PARENT_CD3, PARENT_CD4) 
VALUES (
    '1211',
    '현금',
    '5',
    '1',
    '1000',
    '1100',
    '1200',
    '1210' );
    
commit;