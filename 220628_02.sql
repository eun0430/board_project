select grp_cd, sum(deb_amount)
from haeun.ac_slip
where slip_date = '20220101'
group by grp_cd ;


select grp_cd, rank () over(order by grp_cd)
from haeun.ac_slip
where slip_date = '20220101'
group by grp_cd ;


select grp_cd, dtl_cd,
rank () over(order by grp_cd, dtl_cd) 
from haeun.ac_slip
where slip_date = '20220101'
group by grp_cd, dtl_cd ;


select grp_cd, dtl_cd, sum(deb_amount), 
rank () over(partition by grp_cd order by grp_cd, dtl_cd),--grp에 그룹을 만든 후 그 순위를 매기는 것 (중복이 없기 떄문에 1로 다 설정됨)
rank () over(order by grp_cd, dtl_cd)
from haeun.ac_slip
where slip_date like '202201%'
group by grp_cd, dtl_cd ;

select count(*)
from ac_slip s inner join hr_master_info i on s.EMPLOYEE_KEY = i.EMPLOYEE_KEY
where s.slip_date between '20220101' and '20220131' ;

select s.employee_key, i.employee_key, i.employee_name
from ac_slip s inner join hr_master_info i on s.EMPLOYEE_KEY = i.EMPLOYEE_KEY
where s.slip_date between '20220101' and '20220131' 
group by (s.employee_key, i.employee_key, i.employee_name) ;

select count(*)
from ac_slip s inner join hr_master_info i on s.EMPLOYEE_KEY = i.EMPLOYEE_KEY
left outer join hr_code_organization o on S.ORGANIZATION_CODE = o.organization_code -- 순서 바뀌어도 상관 없음
where s.slip_date between '20220101' and '20220131' 
;

select S.EMPLOYEE_KEY, S.ORGANIZATION_CODE, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from ac_slip s left outer join hr_code_organization o on S.ORGANIZATION_CODE = o.organization_code 
--inner join hr_master_info i on s.EMPLOYEE_KEY = i.EMPLOYEE_KEY
where s.slip_date between '20220101' and '20220131' 
group by (S.EMPLOYEE_KEY, S.ORGANIZATION_CODE, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME) ;

select S.EMPLOYEE_KEY, I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, S.ORGANIZATION_CODE, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from ac_slip s left outer join hr_code_organization o on S.ORGANIZATION_CODE = o.organization_code 
inner join hr_master_info i on s.EMPLOYEE_KEY = i.EMPLOYEE_KEY
where s.slip_date between '20220101' and '20220131' 
group by (S.EMPLOYEE_KEY, I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, S.ORGANIZATION_CODE, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME) ;

select S.EMPLOYEE_KEY, I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, S.ORGANIZATION_CODE, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from ac_slip s inner join hr_code_organization o on S.ORGANIZATION_CODE = o.organization_code 
inner join hr_master_info i on s.EMPLOYEE_KEY = i.EMPLOYEE_KEY
where s.slip_date between '20220101' and '20220131' 
group by (S.EMPLOYEE_KEY, I.EMPLOYEE_KEY, I.EMPLOYEE_NAME, S.ORGANIZATION_CODE, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME);  

--right outer 주로 사용 안함 헷갈리게 하지ㅏ 않기 위해 left join으로 주로 작성

--cross join on의 조건 필요 없음



select I.EMPLOYEE_KEY
from hr_master_info i
where I.EMPLOYEE_NAME='최하은';

select *
from hr_master_info i cross join hr_code_organization
where I.EMPLOYEE_KEY='060211' ;


select I.EMPLOYEE_KEY, O.ORGANIZATION_CODE, O.ORGANIZATION_NAME
from hr_master_info i cross join hr_code_organization o 
where I.EMPLOYEE_KEY='060211' ;


