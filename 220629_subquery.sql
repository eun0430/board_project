select *
from ac_slip
where slip_cls||slip_date||slip_no||slip_seq in
(select slip_cls||slip_date||slip_no||slip_seq
 from ac_slip
 where grp_cd='1311') ; --하나의 문자로 처리되 값이 하나만 나옴 뒤에 slip_seq를 지우면 해당되는 여러 값 출력 가능
 
select *
from ac_slip
where slip_cls||slip_date||slip_no in
(HR_MASTER_INFO ) ;

select S.EMPLOYEE_KEY, z.EMPLOYEE_NAME, z.ORGANIZATION_CODE, z.organization_name
from ac_slip s inner join (
select I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, I.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from HR_MASTER_INFO i left outer join HR_CODE_ORGANIZATION o on I.ORGANIZATION_CODE = O.ORGANIZATION_CODE ) z
on z.EMPLOYEE_KEY = S.EMPLOYEE_KEY
group by s.employee_key, z.EMPLOYEE_NAME, z.ORGANIZATION_CODE, z.organization_name --group으로 묶어서 중복 제거
order by z.organization_code ;  --부서명을 기준으로 order by 명령을 사용해서 오름차순 굳이 asc는 기본값이기 때문에 따로 작성 안해도 됨


-- ORA-00918: 열의 정의가 애매합니다 오류 > 어느 테이블에서 가져올 지 정의가 애매 (앞에 테이블을 지정해줘야 함) 
-- ORA-00979: GROUP BY 표현식이 아닙니다 오류 > group by로 묶을 시 select문에 적었던 컬럼 명 다 명시해줘야 함.)
-- 위 코드를 이용해서 한 부서의 여러명의 사원이 있음 > 부서의 사원이 많은 순서대로 rank이용해서 출력하기 숙제! (부서code를 이용해서 해보기)
-- 서브쿼리를 사용하지 않고 위와 같은 결과 도출하는 숙제 > 하나의 select문만 이용해서 작성


select I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, I.ORGANIZATION_CODE, 
(select O.ORGANIZATION_NAME
from HR_CODE_ORGANIZATION o
where I.ORGANIZATION_CODE = O.ORGANIZATION_CODE) as B5
from HR_MASTER_INFO i ;





