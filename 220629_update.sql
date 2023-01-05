--update 내 사원번호 : 060211

alter table HAEUN.HR_MASTER_INFO ADD 
organization_name varchar2(30) ; --테이블 수정


update HR_MASTER_INFO 
set organization_name='개발2팀'
where EMPLOYEE_KEY='060211' ; -- 이거 빼먹으면 모든 데이터에 삽입됨 실무에서 사고침 이거 매우 중요!!

update HR_MASTER_INFO i
set i.organization_name=
(select O.ORGANIZATION_NAME
 from HR_CODE_ORGANIZATION o 
 where O.ORGANIZATION_CODE = I.ORGANIZATION_CODE) ;
 
-- ORA-01427: 단일 행 하위 질의에 2개 이상의 행이 리턴되었습니다 오류 > 단일행 서브쿼리로 작성해야함 
-- 1:N 의 관계가 성립될 수 없음 하나의 결과값을 도출해야하는데 두개의 값이 도출되어 코드를 실행할 수 없음

-- where을 작성안한 이유 = 모든 사원의 데이터 정보를 추가하는것이여서 따로 조건을 줄 필요가 없음
-- 결과 확인 >원하는 결과가  맞으면 commit, 실수했으면 rollback

-- AC_SLIP 테이블의 
-- 사원번호, 부서코드, grp_cd, dtl_cd 를 명으로 해서 컬럼 추가하고 update를 이용해 데이터 삽입

