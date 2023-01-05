-- TEST 1) 예제 코드를 서브쿼리를 사용하지 않고 출력하기
-- 예제 코드 --
select S.EMPLOYEE_KEY, z.EMPLOYEE_NAME, z.ORGANIZATION_CODE, z.organization_name
from ac_slip s inner join (
select I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, I.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from HR_MASTER_INFO i left outer join HR_CODE_ORGANIZATION o on I.ORGANIZATION_CODE = O.ORGANIZATION_CODE ) z
on z.EMPLOYEE_KEY = S.EMPLOYEE_KEY
group by s.employee_key, z.EMPLOYEE_NAME, z.ORGANIZATION_CODE, z.organization_name;


-- TEST 1 A.
select S.EMPLOYEE_KEY, I.EMPLOYEE_NAME, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from HR_MASTER_INFO I, HR_CODE_ORGANIZATION O, AC_SLIP S
where I.ORGANIZATION_CODE = O.ORGANIZATION_CODE and I.EMPLOYEE_KEY = S.EMPLOYEE_KEY
group by S.EMPLOYEE_KEY, I.EMPLOYEE_NAME, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME ;

-- TEST 2) 예제 코드를 이용하여 한 부서의 여러명의 팀원 존재 -> 부서의 사람이 많은 순서대로 rank()를 이용하여 순위 매기기

-- 부서별 인원 수 파악
select organization_name, count(organization_code) as 사원수,
rank() over(order by count(organization_code) desc) as 순위
from HR_MASTER_INFO 
group by organization_name ;

-- 혜린 언니 코드 --
SELECT d.organization_name as 부서명 ,
       COUNT (d.employee_key) as 사원수 ,
       RANK () OVER (ORDER BY COUNT (D.employee_key) desc) as 순위 
  FROM     (SELECT A.EMPLOYEE_KEY, B.organization_name
             FROM hr_master_info A, hr_code_organization B
            WHERE a.organization_code = b.organization_code) D
            group by d.organization_name ;


-- TEST 3) alter로 추가한 컬럼에 update로 데이터 삽입
update AC_SLIP s
set s.organization_name=
(select I.EMPLOYEE_NAME 
 from HR_MASTER_INFO i
 where I.EMPLOYEE_KEY = S.EMPLOYEE_KEY ) ;