--
-- PostgreSQL database dump
--

\restrict sMOwZTadJLybjgRXWlfAgCq5QD9EFbt2dQfzsP12izRpNC6vQiiIs0PabkrEbwH

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: a_block_after_500(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.a_block_after_500(p_user_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$ 
declare fine int:=0 ; days int ;
begin
   select coalesce(max(current_date - issue_date::date),0) into days from tbl_book_issue 
   where user_id = p_user_id and return_date is null;
   
    if days > 7 then 
    fine := (days-7)*5;
	end if;
	
    if fine > 5 then 
	-- update tbl_users set is_active = false where user_id = p_user_id ;
	return 1;
	end if;	
end;
$$;


ALTER FUNCTION public.a_block_after_500(p_user_id integer) OWNER TO postgres;

--
-- Name: a_fine_calculation(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.a_fine_calculation(p_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$ 
declare 
        fine int:=0 ;
        fine_day int ;
begin

   select  coalesce(max(current_date - issue_date::date),0)
   into fine_day from tbl_book_issue where user_id = p_id and return_date is null;
   if fine_day > 7 then 
     fine :=(fine_day-7)*5;
	 return fine;
   end if;
end;
$$;


ALTER FUNCTION public.a_fine_calculation(p_id integer) OWNER TO postgres;

--
-- Name: a_issue_book_limmit(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.a_issue_book_limmit(p_user_id integer, p_book_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
declare count int;
  flag int;
begin  
    select count(*) into count from tbl_book_issue i where i.user_id = p_user_id and i.return_date is null;
	if count >=3 then 
	   flag=0;
	   return flag;
	end if ;

	insert into tbl_book_issue(user_id,book_id,issue_date)values(p_user_id,p_book_id,current_date);
	flag =1;
	return flag;
	
end;
$$;


ALTER FUNCTION public.a_issue_book_limmit(p_user_id integer, p_book_id integer) OWNER TO postgres;

--
-- Name: check_user_overdue(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_user_overdue(p_user_id integer) RETURNS boolean
    LANGUAGE sql
    AS $$
 SELECT EXISTS(SELECT 1 FROM TBL_BOOK_ISSUE I WHERE I.user_id =p_user_id and i.return_date IS NULl
 and current_date> i.due_date);
 $$;


ALTER FUNCTION public.check_user_overdue(p_user_id integer) OWNER TO postgres;

--
-- Name: custom_login(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.custom_login(email character varying, pass character varying) RETURNS TABLE(status text, o_flag integer, u_id integer, u_name character varying, u_email character varying, u_pass character varying, u_role character varying, u_count integer, u_dur timestamp with time zone, roles character varying, role_permission character varying[])
    LANGUAGE plpgsql
    AS $$
 
DECLARE  
	l_user RECORD;
	v_role varchar;
	v_permissions varchar[];

begin
	 select * into l_user from tbl_users where user_email =email and is_active =true;
	 -- mail verify
	 if not found then
	 	return query select 'error',0,NULL::INT,NULL::VARCHAR,NULL::VARCHAR,
		 null::varchar,null::varchar,null::int,null::TIMESTAMPTZ,null::varchar,ARRAY[]::varchar[];
		return;
	 end if;

	select r.role_name into v_role from tbl_user_role ur
	join tbl_roles r on r.role_id=ur.role_id where ur.user_id=l_user.user_id;

	select array_agg(DISTINCT p.permission_name)into v_permissions from tbl_user_role ur
	join tbl_role_permission rp on rp.role_id=ur.role_id join tbl_permissions p 
	on p.permission_id=rp.permission_id where ur.user_id = l_user.user_id and rp.is_active = true;
	-- success login
	
	RETURN QUERY SELECT 'success',2,l_user.user_id,l_user.user_name,l_user.user_email,l_user.user_password,
	l_user.role,l_user.count,l_user.duration,v_role,
    COALESCE(v_permissions, ARRAY[]::VARCHAR[]);
end ;
$$;


ALTER FUNCTION public.custom_login(email character varying, pass character varying) OWNER TO postgres;

--
-- Name: delete_author_detail(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_author_detail(a_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
	update tbl_author set status = 'deactivate',updated_at=Now() where author_id =a_id;
end;
$$;


ALTER FUNCTION public.delete_author_detail(a_id integer) OWNER TO postgres;

--
-- Name: delete_book_detail(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_book_detail(b_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
     update tbl_books set status='deactive' , updated_at=Now() where book_id=b_id;
	 
end;
$$;


ALTER FUNCTION public.delete_book_detail(b_id integer) OWNER TO postgres;

--
-- Name: delete_category_detail(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_category_detail(c_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
     update tbl_categories set status='deactive',updated_at=Now() where category_id=c_id;
end;
$$;


ALTER FUNCTION public.delete_category_detail(c_id integer) OWNER TO postgres;

--
-- Name: delete_image(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_image(i_id integer) RETURNS text
    LANGUAGE plpgsql
    AS $$ begin 
    delete from tbl_image i where i.image_id = i_id ;
	return 'deleted..!';
end;
$$;


ALTER FUNCTION public.delete_image(i_id integer) OWNER TO postgres;

--
-- Name: delete_librarian(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_librarian(id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
     update tbl_users set is_active=false where user_id = id;
end;
$$;


ALTER FUNCTION public.delete_librarian(id integer) OWNER TO postgres;

--
-- Name: delete_right(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_right(id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
delete from tbl_permissions where permission_id = id ;
end;
$$;


ALTER FUNCTION public.delete_right(id integer) OWNER TO postgres;

--
-- Name: delete_role(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_role(id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
  delete from tbl_roles where role_id = id ;
end;
$$;


ALTER FUNCTION public.delete_role(id integer) OWNER TO postgres;

--
-- Name: demo_opration(character varying, integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.demo_opration(p_action character varying, p_id integer, p_name character varying, p_email character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
 if p_action = 'insert' then
    insert into tbl_demo(u_name,u_email)values(p_name,p_email);
	return 'user insertes successfull..!';
 elseif p_action = 'update' then
   update tbl_demo set u_name = p_name ,u_email= p_email where u_id = p_id;
   return 'updated successfully..!';
 else 
   return 'invalid action..!';
 end if;
end;
$$;


ALTER FUNCTION public.demo_opration(p_action character varying, p_id integer, p_name character varying, p_email character varying) OWNER TO postgres;

--
-- Name: get_admin_user_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_admin_user_data() RETURNS TABLE(i_user_id integer, i_user_name character varying, i_user_email character varying, i_role character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query select u.user_id ,u.user_name ,u.user_email, u.role from tbl_users u;
END;
$$;


ALTER FUNCTION public.get_admin_user_data() OWNER TO postgres;

--
-- Name: get_all_author_detail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_author_detail() RETURNS TABLE(author_id integer, author_name character varying, status character varying, created_by integer, updated_by integer, created_at timestamp without time zone, updated_at timestamp without time zone, update_reason character varying)
    LANGUAGE plpgsql
    AS $$
begin
     return query
     select * from tbl_author a where a.status='active' order by author_id asc;
end;
$$;


ALTER FUNCTION public.get_all_author_detail() OWNER TO postgres;

--
-- Name: get_all_books_detail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_books_detail() RETURNS TABLE(book_id integer, book_name character varying, category_name character varying, author_name character varying, book_page numeric, copies numeric, avl_qty numeric, status character varying)
    LANGUAGE plpgsql
    AS $$
begin
     return query select b.book_id , b.book_name,c.category_name,a.author_name,
	 b.book_page , b.copies,b.avl_qty, b.status 
	 from tbl_books b inner join tbl_categories c on b.category_id = c.category_id 
	 inner join tbl_author a on b.author_id = a.author_id where b.status = 'active' order by book_id asc;
	 
end;
$$;


ALTER FUNCTION public.get_all_books_detail() OWNER TO postgres;

--
-- Name: get_all_category_detail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_all_category_detail() RETURNS TABLE(category_id integer, category_name character varying, status character varying, created_by integer, updated_by integer, created_at timestamp without time zone, updated_at timestamp without time zone, update_reason character varying)
    LANGUAGE plpgsql
    AS $$
begin
    return query 
	select * from tbl_categories c where c.status = 'active' order by category_id asc;
end;
$$;


ALTER FUNCTION public.get_all_category_detail() OWNER TO postgres;

--
-- Name: get_audit_log(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_audit_log() RETURNS TABLE(i_audit_id integer, i_user_name character varying, i_action character varying, i_module character varying, i_des text, i_created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
	 return Query select a.audit_id ,u.user_name ,a.action ,a.module , a.description ,a.created_at  
	 FROM tbl_audit_log a
    INNER JOIN tbl_users u 
        ON u.user_id = a.user_id
    ORDER BY a.created_at ASC;
END
$$;


ALTER FUNCTION public.get_audit_log() OWNER TO postgres;

--
-- Name: get_category_pagination(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_category_pagination(p_page integer, p_page_size integer) RETURNS TABLE(category_id integer, category_name character varying)
    LANGUAGE plpgsql
    AS $$ begin
   return query select c.category_id,c.category_name from tbl_categories c limit p_page_size offset (p_page-1)*p_page_size ;
end;
$$;


ALTER FUNCTION public.get_category_pagination(p_page integer, p_page_size integer) OWNER TO postgres;

--
-- Name: get_filter_audit(timestamp without time zone, timestamp without time zone, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_filter_audit(sdate timestamp without time zone, edate timestamp without time zone, u_id integer, act character varying) RETURNS TABLE(i_audit_id integer, i_user_name character varying, i_action character varying, i_module character varying, i_description text, i_created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
	 return Query select a.audit_id ,u.user_name ,a.action ,a.module , a.description ,a.created_at  
	 FROM tbl_audit_log a
     inner JOIN tbl_users u 
        ON u.user_id = a.user_id 
	 where (sdate is null or a.created_at >= sdate)
        and (edate is null or a.created_at <= edate + interval '1 day')
	 and (u_id IS NULL OR a.user_id = u_id ) and (act IS NULL OR lower(a.action) = lower(act) )
     ORDER BY a.created_at ASC;
END;
$$;


ALTER FUNCTION public.get_filter_audit(sdate timestamp without time zone, edate timestamp without time zone, u_id integer, act character varying) OWNER TO postgres;

--
-- Name: get_image(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_image() RETURNS TABLE(image_id integer, image_file text, image_name character varying, image_pdf character varying)
    LANGUAGE plpgsql
    AS $$
 begin 
    return query select * from tbl_image a;
end;
$$;


ALTER FUNCTION public.get_image() OWNER TO postgres;

--
-- Name: get_image_pagination(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_image_pagination(p_page integer, p_page_size integer) RETURNS TABLE(image_id integer, image_file text, image_name character varying, image_pdf character varying)
    LANGUAGE plpgsql
    AS $$
begin
  return query select * from tbl_image a limit p_page_size offset(p_page-1)*p_page_size;
end ;
$$;


ALTER FUNCTION public.get_image_pagination(p_page integer, p_page_size integer) OWNER TO postgres;

--
-- Name: get_issue_book_detail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_issue_book_detail() RETURNS TABLE(i_issue_id integer, i_user_name character varying, i_book_name character varying, i_issue_date timestamp without time zone, i_due_date timestamp without time zone, i_return_date timestamp without time zone, i_status character varying, i_fine integer)
    LANGUAGE plpgsql
    AS $$
begin
 return query select i.issue_id, u.user_name ,b.book_name,i.issue_date,i.due_date,i.return_date,
 (CASE
        
	 WHEN i.return_date IS NOT NULL THEN 'RETURNED'
	 WHEN CURRENT_DATE <= i.due_date THEN 'ISSUED'
	 ELSE 'OVERDUE'
END )::varchar AS i_status ,

 (CASE
        WHEN i.return_date IS NOT NULL 
             AND i.return_date > i.due_date
        THEN (i.return_date::date - i.due_date::date) * 5

        WHEN i.return_date IS NULL 
             AND CURRENT_DATE > i.due_date
        THEN (CURRENT_DATE - i.due_date::date) * 5

        ELSE 0
    END )::int AS i_fine
	
 from tbl_book_issue i 
 inner join tbl_users u on u.user_id = i.user_id 
 inner join tbl_books b on b.book_id = i.book_id order by issue_id asc ;

end;
$$;


ALTER FUNCTION public.get_issue_book_detail() OWNER TO postgres;

--
-- Name: get_issue_user_detail(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_issue_user_detail(u_id integer) RETURNS TABLE(i_issue_id integer, i_user_name character varying, i_book_name character varying, i_issue_date timestamp without time zone, i_due_date timestamp without time zone, i_return_date timestamp without time zone, i_status character varying)
    LANGUAGE plpgsql
    AS $$
begin
 return query select i.issue_id, u.user_name ,b.book_name,i.issue_date,i.due_date,i.return_date,i.status from tbl_book_issue i 
 inner join tbl_users u on u.user_id = i.user_id 
 inner join tbl_books b on b.book_id = i.book_id where i.user_id = u_id order by issue_id asc ;
end;
$$;


ALTER FUNCTION public.get_issue_user_detail(u_id integer) OWNER TO postgres;

--
-- Name: get_librarian(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_librarian() RETURNS TABLE(u_id integer, u_name character varying, u_email character varying)
    LANGUAGE plpgsql
    AS $$
begin
   return query select user_id,user_name,user_email from tbl_users where role = 'LIBRARIAN' and is_active=true;
end ;
$$;


ALTER FUNCTION public.get_librarian() OWNER TO postgres;

--
-- Name: get_login_audit(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_login_audit() RETURNS TABLE(i_id integer, i_email character varying, user_name character varying, i_activity character varying, i_status character varying, i_created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY SELECT l.login_audit_id,l.email,u.user_name,l.activity_type ,l.status ,l.created_at
	from tbl_login_audit l left join tbl_users u on u.user_id = l.user_id order by login_audit_id asc;
END;
$$;


ALTER FUNCTION public.get_login_audit() OWNER TO postgres;

--
-- Name: get_overdue_list(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_overdue_list() RETURNS TABLE(i_issue_id integer, i_user_name character varying, i_book_namee character varying, i_issue_date timestamp without time zone, i_duedate timestamp without time zone, i_return_date timestamp without time zone, i_status character varying, i_fine integer)
    LANGUAGE plpgsql
    AS $$
begin 
      return query select i.issue_id, u.user_name ,b.book_name,i.issue_date,i.due_date,i.return_date,
 (CASE
        
	 WHEN i.return_date IS NOT NULL THEN 'RETURNED'
	 WHEN CURRENT_DATE <= i.due_date THEN 'ISSUED'
	 ELSE 'OVERDUE'
END )::varchar AS i_status ,
(CASE
        WHEN i.return_date IS NOT NULL 
             AND i.return_date > i.due_date
        THEN (i.return_date::date - i.due_date::date) * 5

        WHEN i.return_date IS NULL 
             AND CURRENT_DATE > i.due_date
        THEN (CURRENT_DATE - i.due_date::date) * 5

        ELSE 0
    END )::int AS i_fine
	
 from tbl_book_issue i 
 inner join tbl_users u on u.user_id = i.user_id 
 inner join tbl_books b on b.book_id = i.book_id where  i.return_date IS NULL AND CURRENT_DATE > i.due_date
 order by issue_id asc ;
end;
$$;


ALTER FUNCTION public.get_overdue_list() OWNER TO postgres;

--
-- Name: get_rights(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_rights() RETURNS TABLE(permission_id integer, permission_name character varying, description text)
    LANGUAGE plpgsql
    AS $$
begin
   return query select * from tbl_permissions order by permission_id asc;
end;
$$;


ALTER FUNCTION public.get_rights() OWNER TO postgres;

--
-- Name: get_role(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_role() RETURNS TABLE(r_id integer, r_name character varying)
    LANGUAGE plpgsql
    AS $$
begin
   return query select role_id,role_name from tbl_roles;
end;$$;


ALTER FUNCTION public.get_role() OWNER TO postgres;

--
-- Name: get_role_rights(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_role_rights(r_id integer) RETURNS TABLE(id integer, role_name character varying, right_name character varying, is_active boolean)
    LANGUAGE plpgsql
    AS $$
 
begin
    return query select rp.id,r.role_name,p.permission_name ,rp.is_active from tbl_role_permission rp 
	inner join tbl_roles r on r.role_id=rp.role_id 
	inner join tbl_permissions p on p.permission_id=rp.permission_id
	where rp.role_id =r_id;
end;
$$;


ALTER FUNCTION public.get_role_rights(r_id integer) OWNER TO postgres;

--
-- Name: get_search_user_audit(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_search_user_audit(p_name character varying) RETURNS TABLE(i_id integer, i_email character varying, user_name character varying, i_activity character varying, i_status character varying, i_created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
declare 
	p_id int;
BEGIN

	select user_id into p_id from tbl_users u where lower(u.user_name)  like '%' || p_name ||'%';
    RETURN QUERY SELECT l.login_audit_id,l.email,u.user_name,l.activity_type ,l.status ,l.created_at
	from tbl_login_audit l inner join tbl_users u on u.user_id = l.user_id where l.user_id = p_id order by login_audit_id asc;
END;
$$;


ALTER FUNCTION public.get_search_user_audit(p_name character varying) OWNER TO postgres;

--
-- Name: get_serach_issue_book(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_serach_issue_book(u_name character varying) RETURNS TABLE(i_issue_id integer, i_user_name character varying, i_book_name character varying, i_issue_date timestamp without time zone, i_due_date timestamp without time zone, i_return_date timestamp without time zone, i_status character varying)
    LANGUAGE plpgsql
    AS $$
begin
 return query select i.issue_id, u.user_name ,b.book_name,i.issue_date,i.due_date,i.return_date,i.status from tbl_book_issue i 
 inner join tbl_users u on u.user_id = i.user_id 
 inner join tbl_books b on b.book_id = i.book_id where i.status='ISSUED' and lower(u.user_name) LIKE '%' || u_name || '%' order by issue_id asc ;
end;
$$;


ALTER FUNCTION public.get_serach_issue_book(u_name character varying) OWNER TO postgres;

--
-- Name: get_user_audit(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_audit(p_email character varying) RETURNS TABLE(i_id integer, i_email character varying, user_name character varying, i_activity character varying, i_status character varying, i_created_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY SELECT l.login_audit_id,l.email,u.user_name,l.activity_type ,l.status ,l.created_at
	from tbl_login_audit l left join tbl_users u on u.user_id = l.user_id where l.email = p_email order by login_audit_id asc;
END;
$$;


ALTER FUNCTION public.get_user_audit(p_email character varying) OWNER TO postgres;

--
-- Name: get_user_by_email(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_by_email(email character varying) RETURNS TABLE(user_id integer, user_name character varying, user_email character varying, role character varying, is_active boolean)
    LANGUAGE plpgsql
    AS $$ 
begin 
   return Query select u.user_id,u.user_name,u.user_email,u.role,u.is_active from tbl_users u where u.user_email = email;
end;
$$;


ALTER FUNCTION public.get_user_by_email(email character varying) OWNER TO postgres;

--
-- Name: get_user_by_token(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_by_token(p_token character varying) RETURNS TABLE(user_name character varying, is_active boolean)
    LANGUAGE plpgsql
    AS $$
begin
    
      return query select u.user_name ,u.is_active from tbl_users u where email_token = p_token 
	  AND u.token_created_at > NOW() - INTERVAL '5 minutes';
   
end;
$$;


ALTER FUNCTION public.get_user_by_token(p_token character varying) OWNER TO postgres;

--
-- Name: get_user_data(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_data(u_id integer) RETURNS TABLE(user_name character varying, user_email character varying)
    LANGUAGE plpgsql
    AS $$
begin 
  return query select a.user_name,a.user_email from tbl_users a where user_id=u_id;
end;
$$;


ALTER FUNCTION public.get_user_data(u_id integer) OWNER TO postgres;

--
-- Name: get_user_report(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_report(u_id integer) RETURNS TABLE(i_issue_id integer, i_user_name character varying, i_book_name character varying, i_issue_date timestamp without time zone, i_duedate timestamp without time zone, i_return_date timestamp without time zone, i_status character varying)
    LANGUAGE plpgsql
    AS $$
begin
    return Query select i.issue_id ,u.user_name ,b.book_name ,i.issue_date,i.due_date,i.return_date,i.status
	from tbl_book_issue i inner join tbl_users u on u.user_id = i.user_id
	inner join tbl_books b on b.book_id = i.book_id where i.user_id =u_id order by issue_id asc;
end;
$$;


ALTER FUNCTION public.get_user_report(u_id integer) OWNER TO postgres;

--
-- Name: get_users_detail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_users_detail() RETURNS TABLE(u_id integer, u_name character varying, u_email character varying)
    LANGUAGE plpgsql
    AS $$
begin
  return query select u.user_id ,u.user_name ,u.user_email from tbl_users u where role = 'USER';
end;

$$;


ALTER FUNCTION public.get_users_detail() OWNER TO postgres;

--
-- Name: grant_remove_rights(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.grant_remove_rights(rp_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin

    update tbl_role_permission
    set is_active = NOT is_active
    where id = rp_id;

end;
$$;


ALTER FUNCTION public.grant_remove_rights(rp_id integer) OWNER TO postgres;

--
-- Name: insert_audit_log(integer, character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_audit_log(p_user_id integer, p_action character varying, p_module character varying, p_des text) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
BEGIN
   insert into tbl_audit_log(user_id ,action ,module,description)
   values(p_user_id,p_action,p_module,p_des);
END;
$$;


ALTER FUNCTION public.insert_audit_log(p_user_id integer, p_action character varying, p_module character varying, p_des text) OWNER TO postgres;

--
-- Name: insert_login_audit(character varying, integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_login_audit(p_email character varying, p_user_id integer, p_activity_type character varying, p_status character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
     insert into tbl_login_audit(email,user_id,activity_type,status)
	 values(p_email,p_user_id ,p_activity_type ,p_status );
END;
$$;


ALTER FUNCTION public.insert_login_audit(p_email character varying, p_user_id integer, p_activity_type character varying, p_status character varying) OWNER TO postgres;

--
-- Name: insert_role_permission(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_role_permission(p_role_id integer, p_permission_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
    insert into tbl_role_permission(role_id,permission_id,is_active)values(p_role_id,p_permission_id,true);
end; 
$$;


ALTER FUNCTION public.insert_role_permission(p_role_id integer, p_permission_id integer) OWNER TO postgres;

--
-- Name: insert_user_role(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_user_role(p_user_id integer, p_role_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
     insert into tbl_user_role(user_id,role_id)values(p_user_id,p_role_id);
end;$$;


ALTER FUNCTION public.insert_user_role(p_user_id integer, p_role_id integer) OWNER TO postgres;

--
-- Name: login_user(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.login_user(email character varying) RETURNS TABLE(u_id integer, u_name character varying, u_email character varying, u_pass character varying, count integer, duration timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
begin 
return query select  a.user_id,a.user_name,a.user_email,a.user_password ,a.count ,a.duration from tbl_users a where a.user_email=email and a.is_active= True;
end ;
$$;


ALTER FUNCTION public.login_user(email character varying) OWNER TO postgres;

--
-- Name: post_author(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_author(author_name character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin 
    insert into tbl_author(author_name)values(author_name);
	return 'author inserted sucessfully..';
end;
$$;


ALTER FUNCTION public.post_author(author_name character varying) OWNER TO postgres;

--
-- Name: post_contact_us(character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_contact_us(c_name character varying, c_email character varying, c_msg character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
   insert into tbl_contactUs(contact_name,contact_email,contact_msg)values(c_name,c_email,c_msg);
   return 'Thanks for your time..!';
end;
$$;


ALTER FUNCTION public.post_contact_us(c_name character varying, c_email character varying, c_msg character varying) OWNER TO postgres;

--
-- Name: post_image(text, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_image(i_file text, i_name character varying, i_pdf character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
 begin
  insert into tbl_image(image_file ,image_name,image_pdf) values(i_file,i_name,i_pdf);
  return 'image inserted..';
 end;
$$;


ALTER FUNCTION public.post_image(i_file text, i_name character varying, i_pdf character varying) OWNER TO postgres;

--
-- Name: post_librarian_detail(character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_librarian_detail(p_username character varying, p_email character varying, p_password character varying, p_role character varying, p_token character varying) RETURNS TABLE(user_id integer, user_email character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO tbl_users(user_name, user_email, user_password, role,is_active,email_token)
    VALUES (p_username, p_email, p_password,p_role,TRUE,p_token)
    RETURNING tbl_users.user_id, tbl_users.user_email INTO user_id, user_email;

    RETURN NEXT;
END;
$$;


ALTER FUNCTION public.post_librarian_detail(p_username character varying, p_email character varying, p_password character varying, p_role character varying, p_token character varying) OWNER TO postgres;

--
-- Name: post_rights(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_rights(p_name character varying, p_des character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
begin 
   insert into tbl_permissions(permission_name ,description)values(p_name,p_des);
end;
$$;


ALTER FUNCTION public.post_rights(p_name character varying, p_des character varying) OWNER TO postgres;

--
-- Name: post_role(character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_role(p_name character varying, p_des text) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
   insert into tbl_roles(role_name,description)values(p_name,p_des);
end;
$$;


ALTER FUNCTION public.post_role(p_name character varying, p_des text) OWNER TO postgres;

--
-- Name: post_update_author(character varying, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_update_author(p_action character varying, u_id integer, u_name character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
	if p_action='post' then
		insert into tbl_author(author_name) values(u_name);
		return 'author added ..!';
	elseif p_action='update' then
	     update tbl_author set author_name=u_name ,updated_at = now() where author_id=u_id ;
		 return 'uthor updated..!';
	else 
		return 'invalis action..!' ;
	end if;
end;
$$;


ALTER FUNCTION public.post_update_author(p_action character varying, u_id integer, u_name character varying) OWNER TO postgres;

--
-- Name: post_update_book(character varying, integer, character varying, integer, integer, numeric, numeric, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_update_book(p_action character varying, b_id integer, b_name character varying, c_id integer, a_id integer, b_page numeric, copy numeric, up_by integer DEFAULT NULL::integer, up_reason character varying DEFAULT NULL::character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
   IF LOWER(TRIM(p_action)) = 'post' THEN  
      insert into tbl_books (book_name,category_id,author_id,book_page,copies,avl_qty)
	  values(b_name,c_id,a_id,b_page,copy,copy);
	  return 'book inserted successfully..!';
	  
   ELSIF LOWER(TRIM(p_action)) = 'update' THEN
       update tbl_books set book_name=b_name ,category_id=c_id , author_id=a_id,
	   book_page = b_page, copies=copy, updated_at = Now() ,
	   updated_by = up_by , update_reason =up_reason where book_id=b_id;
	   return 'book updated..!';

   ELSE
      RETURN 'Invalid action';
   end if;
   
end;
$$;


ALTER FUNCTION public.post_update_book(p_action character varying, b_id integer, b_name character varying, c_id integer, a_id integer, b_page numeric, copy numeric, up_by integer, up_reason character varying) OWNER TO postgres;

--
-- Name: post_update_category(character varying, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_update_category(p_action character varying, cat_id integer, cat_name character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
   if p_action = 'post' then
      insert into tbl_categories(category_name) values(cat_name);
	  return 'category inserted successfully..!';
   elseif p_action ='update' then
       update tbl_categories set category_name = cat_name,updated_at =Now() where category_id = cat_id;
	   return 'category updated..!';
   else
   return 'invalid action..!';
   end if ;
   
end;
$$;


ALTER FUNCTION public.post_update_category(p_action character varying, cat_id integer, cat_name character varying) OWNER TO postgres;

--
-- Name: post_user_detail(character varying, character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.post_user_detail(p_username character varying, p_email character varying, p_password character varying, p_role character varying, p_token character varying) RETURNS TABLE(user_id integer, user_email character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO tbl_users(user_name, user_email, user_password, role,is_active,email_token)
    VALUES (p_username, p_email, p_password,p_role,FALSE,p_token)
    RETURNING tbl_users.user_id, tbl_users.user_email INTO user_id, user_email;

    RETURN NEXT;
END;
$$;


ALTER FUNCTION public.post_user_detail(p_username character varying, p_email character varying, p_password character varying, p_role character varying, p_token character varying) OWNER TO postgres;

--
-- Name: read_delete_demo(character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.read_delete_demo(p_action character varying, p_id integer) RETURNS TABLE(u_id integer, u_name character varying, u_email character varying)
    LANGUAGE plpgsql
    AS $$ 
begin
  if p_action ='read' then
  return query 
  select d.u_id,d.u_name,d.u_email from tbl_demo d ;
  
  elseif p_action ='delete' then
  delete from tbl_demo d where d.u_id=p_id
  returning d.u_id,d.u_name,d.u_email;
  end if;
 end;
 $$;


ALTER FUNCTION public.read_delete_demo(p_action character varying, p_id integer) OWNER TO postgres;

--
-- Name: search_book(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_book(c_name character varying) RETURNS TABLE(book_id integer, book_name character varying, category_name character varying, author_name character varying, book_page numeric, copies numeric, status character varying)
    LANGUAGE plpgsql
    AS $$
begin
    return query
    select b.book_id,b.book_name,c.category_name,a.author_name,b.book_page,b.copies ,b.status from tbl_books b 
	join tbl_categories c on c.category_id = b.category_id 
	join tbl_author a on a.author_id =b.author_id where c.category_name = c_name;
end;
$$;


ALTER FUNCTION public.search_book(c_name character varying) OWNER TO postgres;

--
-- Name: search_cat(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_cat(cat_name character varying) RETURNS TABLE(category_id integer, category_name character varying)
    LANGUAGE plpgsql
    AS $$ begin
return query select c.category_id,c.category_name from tbl_categories c where c.category_name like '%' || cat_name ||'%' ;
end;
$$;


ALTER FUNCTION public.search_cat(cat_name character varying) OWNER TO postgres;

--
-- Name: send_copy_available_qty_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_copy_available_qty_count() RETURNS TABLE(copy numeric, avl numeric)
    LANGUAGE sql
    AS $$
    SELECT 
        COUNT(*) AS copy,
        COUNT(*) FILTER (WHERE avl_qty > 0) AS avl
    FROM tbl_books where status='active';
$$;


ALTER FUNCTION public.send_copy_available_qty_count() OWNER TO postgres;

--
-- Name: send_isuue_return_book_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_isuue_return_book_count() RETURNS TABLE(issue numeric, retur numeric)
    LANGUAGE sql
    AS $$
    select count (*) filter(where status ='ISSUED') as issue,
	count(*) filter(where status='RETURNED') as retur from tbl_book_issue;
$$;


ALTER FUNCTION public.send_isuue_return_book_count() OWNER TO postgres;

--
-- Name: send_overdue_mail(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.send_overdue_mail() RETURNS TABLE(i_issue_id integer, i_user_mail character varying, i_user_name character varying, i_book_namee character varying, i_issue_date timestamp without time zone, i_duedate timestamp without time zone, i_return_date timestamp without time zone, i_status character varying, i_fine integer)
    LANGUAGE plpgsql
    AS $$
begin 
      return query select i.issue_id, u.user_email,u.user_name ,b.book_name,i.issue_date,i.due_date,i.return_date,
 (CASE
        
	 WHEN i.return_date IS NOT NULL THEN 'RETURNED'
	 WHEN CURRENT_DATE <= i.due_date THEN 'ISSUED'
	 ELSE 'OVERDUE'
END )::varchar AS i_status ,
(CASE
        WHEN i.return_date IS NOT NULL 
             AND i.return_date > i.due_date
        THEN (i.return_date::date - i.due_date::date) * 5

        WHEN i.return_date IS NULL 
             AND CURRENT_DATE > i.due_date
        THEN (CURRENT_DATE - i.due_date::date) * 5

        ELSE 0
    END )::int AS i_fine
	
 from tbl_book_issue i 
 inner join tbl_users u on u.user_id = i.user_id 
 inner join tbl_books b on b.book_id = i.book_id where  i.return_date IS NULL AND CURRENT_DATE > i.due_date
 order by issue_id asc ;
end;
$$;


ALTER FUNCTION public.send_overdue_mail() OWNER TO postgres;

--
-- Name: total_category(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.total_category() RETURNS integer
    LANGUAGE plpgsql
    AS $$ declare total int ;
   begin
      select count(*) into total from tbl_categories ;
	  return total;
   end;
$$;


ALTER FUNCTION public.total_category() OWNER TO postgres;

--
-- Name: update_author_detail(integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_author_detail(a_id integer, a_name character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$ 
begin 
     update tbl_author set author_name = a_name ,updated_at= Now() where author_id = a_id;
end;
$$;


ALTER FUNCTION public.update_author_detail(a_id integer, a_name character varying) OWNER TO postgres;

--
-- Name: update_count(character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_count(p_email character varying, p_count integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
   update tbl_users  set count = p_count where user_email = p_email;
   return 'updated successfully';
 end;
 $$;


ALTER FUNCTION public.update_count(p_email character varying, p_count integer) OWNER TO postgres;

--
-- Name: update_duration(character varying, timestamp with time zone); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_duration(p_email character varying, p_duration timestamp with time zone) RETURNS text
    LANGUAGE plpgsql
    AS $$
begin 
  update tbl_users set duration = p_duration where user_email= p_email ;
  return 'updated..';
  end;
  $$;


ALTER FUNCTION public.update_duration(p_email character varying, p_duration timestamp with time zone) OWNER TO postgres;

--
-- Name: update_image(integer, text, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_image(f_id integer, f_file text, f_name character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$ begin 
		update tbl_image set image_file = coalesce (f_file,image_file) ,image_name = coalesce(f_name,image_name) where image_id=f_id;
end;
$$;


ALTER FUNCTION public.update_image(f_id integer, f_file text, f_name character varying) OWNER TO postgres;

--
-- Name: update_librarian_detail(integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_librarian_detail(p_id integer, p_username character varying, p_email character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    update tbl_users set user_name = p_username ,user_email=p_email where user_id=p_id;
END;
$$;


ALTER FUNCTION public.update_librarian_detail(p_id integer, p_username character varying, p_email character varying) OWNER TO postgres;

--
-- Name: update_right(integer, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_right(p_id integer, p_name character varying, p_des character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
    update tbl_permissions set permission_name=p_name,description=p_des where permission_id=p_id;

end;
$$;


ALTER FUNCTION public.update_right(p_id integer, p_name character varying, p_des character varying) OWNER TO postgres;

--
-- Name: update_unverified_user(character varying, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_unverified_user(p_name character varying, p_email character varying, p_role character varying, p_token character varying) RETURNS TABLE(user_id integer, user_name character varying, user_email character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE tbl_users u
  SET  user_name =p_name ,user_email = p_email,role=p_role,email_token = p_token,token_created_at = NOW()
  WHERE u.user_email = p_email AND u.is_active = false;
    
  RETURN query select u.user_id ,u.user_name ,u.user_email from tbl_users u where u.user_email =p_email;
   
END;
$$;


ALTER FUNCTION public.update_unverified_user(p_name character varying, p_email character varying, p_role character varying, p_token character varying) OWNER TO postgres;

--
-- Name: user_login_sp(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_login_sp(email character varying, pass character varying) RETURNS TABLE(status text, o_flag integer, u_id integer, u_name character varying, u_email character varying, u_pass character varying, u_count integer)
    LANGUAGE plpgsql
    AS $$
   declare 
   l_user RECORD;
   d_pass varchar;
begin 
    select * into l_user from tbl_users where user_email = email and is_active = TRUE;
	-- email check
	if not found then 
	   return query select 'error',0,NULL::int,NULL::varchar,NULL::varchar,null::varchar,null::int;
	   return;
	end if;
	
    -- unlock after 2 min
	   if l_user.count>=3 AND l_user.duration is not null AND now()>=l_user.duration + INTERVAL '2 minutes' then
	   		update tbl_users set count=0,duration = NULL where user_email =email;
			l_user.count := 0;
            l_user.duration := NULL;
		end if;
		

	-- account lockk
	if l_user.count >=3 then
	     return query select 'error',1,NULL::int,NULL::varchar,NULL::varchar,null::varchar,null::int;
		 return;
	end if;

  -- password check
    -- d_pass := pgp_sym_decrypt(l_user.user_password , 'secrete_key_1104');
	if not (l_user.user_password = pass) then
	    IF l_user.count = 2 THEN
            -- 3rd wrong attempt → lock account
	            UPDATE tbl_users SET count = 3,duration = now() WHERE user_email = email;
	
	            RETURN QUERY SELECT 'LOCKED'::TEXT,2,
	                   NULL::INT, NULL::VARCHAR, NULL::VARCHAR,null::varchar,null::int;
	            RETURN;
		else
		    update tbl_users  set count = count + 1 where user_email = email;
			return query select 'error',3,NULL::int,NULL::varchar,NULL::varchar,null::varchar,l_user.count+1::int;
			return;
		end if;
	end if;
  	
	-- success login
	update tbl_users set count =0 ,duration = null  where user_email = email;
	return query select 'success',4,l_user.user_id,l_user.user_name,l_user.user_email,l_user.user_password,l_user.count;
			 
end;
$$;


ALTER FUNCTION public.user_login_sp(email character varying, pass character varying) OWNER TO postgres;

--
-- Name: verify_user_email(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verify_user_email(p_token character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE tbl_users
    SET is_active = TRUE,
        email_token = NULL
    WHERE email_token = p_token
	AND token_created_at > NOW() - INTERVAL '5 minutes';

    GET DIAGNOSTICS updated_rows = ROW_COUNT;

    IF updated_rows > 0 THEN
        RETURN TRUE;
    ELSE
	    update tbl_users set email_token = null;
        RETURN FALSE;
    END IF;
	
END;
$$;


ALTER FUNCTION public.verify_user_email(p_token character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_book_issue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_book_issue (
    issue_id integer CONSTRAINT book_issue_issue_id_not_null NOT NULL,
    user_id integer,
    book_id integer,
    issue_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp without time zone,
    return_date timestamp without time zone,
    status character varying(20) DEFAULT 'ISSUED'::character varying,
    fine integer DEFAULT 0
);


ALTER TABLE public.tbl_book_issue OWNER TO postgres;

--
-- Name: book_issue_issue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.book_issue_issue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.book_issue_issue_id_seq OWNER TO postgres;

--
-- Name: book_issue_issue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.book_issue_issue_id_seq OWNED BY public.tbl_book_issue.issue_id;


--
-- Name: fine_day; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fine_day (
    "?column?" interval
);


ALTER TABLE public.fine_day OWNER TO postgres;

--
-- Name: tbl_audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_audit_log (
    audit_id integer NOT NULL,
    user_id integer,
    action character varying(50),
    module character varying(100),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tbl_audit_log OWNER TO postgres;

--
-- Name: tbl_audit_log_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_audit_log_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_audit_log_audit_id_seq OWNER TO postgres;

--
-- Name: tbl_audit_log_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_audit_log_audit_id_seq OWNED BY public.tbl_audit_log.audit_id;


--
-- Name: tbl_author; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_author (
    author_id integer NOT NULL,
    author_name character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_by integer DEFAULT 1,
    updated_by integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    update_reason character varying(100) DEFAULT 'system'::character varying
);


ALTER TABLE public.tbl_author OWNER TO postgres;

--
-- Name: tbl_author_author_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_author_author_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_author_author_id_seq OWNER TO postgres;

--
-- Name: tbl_author_author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_author_author_id_seq OWNED BY public.tbl_author.author_id;


--
-- Name: tbl_books; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_books (
    book_id integer NOT NULL,
    book_name character varying(100) NOT NULL,
    category_id integer NOT NULL,
    author_id integer NOT NULL,
    copies numeric NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_by integer DEFAULT 1,
    updated_by integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_reason character varying(100) DEFAULT 'system'::character varying,
    book_page numeric,
    avl_qty numeric
);


ALTER TABLE public.tbl_books OWNER TO postgres;

--
-- Name: tbl_books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_books_book_id_seq OWNER TO postgres;

--
-- Name: tbl_books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_books_book_id_seq OWNED BY public.tbl_books.book_id;


--
-- Name: tbl_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_categories (
    category_id integer NOT NULL,
    category_name character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_by integer DEFAULT 1,
    updated_by integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    update_reason character varying(100) DEFAULT 'system'::character varying
);


ALTER TABLE public.tbl_categories OWNER TO postgres;

--
-- Name: tbl_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_categories_category_id_seq OWNER TO postgres;

--
-- Name: tbl_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_categories_category_id_seq OWNED BY public.tbl_categories.category_id;


--
-- Name: tbl_contactus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_contactus (
    contact_id integer NOT NULL,
    contact_name character varying(100),
    contact_email character varying(100),
    contact_msg character varying(400)
);


ALTER TABLE public.tbl_contactus OWNER TO postgres;

--
-- Name: tbl_contactus_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_contactus_contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_contactus_contact_id_seq OWNER TO postgres;

--
-- Name: tbl_contactus_contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_contactus_contact_id_seq OWNED BY public.tbl_contactus.contact_id;


--
-- Name: tbl_demo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_demo (
    u_id integer NOT NULL,
    u_name character varying(150),
    u_email character varying(200)
);


ALTER TABLE public.tbl_demo OWNER TO postgres;

--
-- Name: tbl_demo_u_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_demo_u_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_demo_u_id_seq OWNER TO postgres;

--
-- Name: tbl_demo_u_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_demo_u_id_seq OWNED BY public.tbl_demo.u_id;


--
-- Name: tbl_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_image (
    image_id integer NOT NULL,
    image_file text NOT NULL,
    image_name character varying(200),
    image_pdf character varying(255)
);


ALTER TABLE public.tbl_image OWNER TO postgres;

--
-- Name: tbl_image_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_image_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_image_image_id_seq OWNER TO postgres;

--
-- Name: tbl_image_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_image_image_id_seq OWNED BY public.tbl_image.image_id;


--
-- Name: tbl_login_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_login_audit (
    login_audit_id integer NOT NULL,
    email character varying(150),
    user_id integer,
    activity_type character varying(50),
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tbl_login_audit OWNER TO postgres;

--
-- Name: tbl_login_audit_login_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_login_audit_login_audit_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_login_audit_login_audit_id_seq OWNER TO postgres;

--
-- Name: tbl_login_audit_login_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_login_audit_login_audit_id_seq OWNED BY public.tbl_login_audit.login_audit_id;


--
-- Name: tbl_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_permissions (
    permission_id integer NOT NULL,
    permission_name character varying(200) NOT NULL,
    description text
);


ALTER TABLE public.tbl_permissions OWNER TO postgres;

--
-- Name: tbl_permissions_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_permissions_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_permissions_permission_id_seq OWNER TO postgres;

--
-- Name: tbl_permissions_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_permissions_permission_id_seq OWNED BY public.tbl_permissions.permission_id;


--
-- Name: tbl_role_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_role_permission (
    id integer NOT NULL,
    role_id integer,
    permission_id integer,
    is_active boolean DEFAULT true
);


ALTER TABLE public.tbl_role_permission OWNER TO postgres;

--
-- Name: tbl_role_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_role_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_role_permission_id_seq OWNER TO postgres;

--
-- Name: tbl_role_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_role_permission_id_seq OWNED BY public.tbl_role_permission.id;


--
-- Name: tbl_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_roles (
    role_id integer NOT NULL,
    role_name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.tbl_roles OWNER TO postgres;

--
-- Name: tbl_roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_roles_role_id_seq OWNER TO postgres;

--
-- Name: tbl_roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_roles_role_id_seq OWNED BY public.tbl_roles.role_id;


--
-- Name: tbl_user_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_user_role (
    id integer NOT NULL,
    user_id integer,
    role_id integer
);


ALTER TABLE public.tbl_user_role OWNER TO postgres;

--
-- Name: tbl_user_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_user_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_user_role_id_seq OWNER TO postgres;

--
-- Name: tbl_user_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_user_role_id_seq OWNED BY public.tbl_user_role.id;


--
-- Name: tbl_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_users (
    user_id integer NOT NULL,
    user_name character varying(200),
    user_email character varying(300),
    user_password character varying,
    is_active boolean DEFAULT true,
    count integer DEFAULT 1,
    duration timestamp with time zone,
    role character varying(10) DEFAULT 'USER'::character varying,
    email_token character varying(255),
    token_created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tbl_users OWNER TO postgres;

--
-- Name: tbl_users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tbl_users_user_id_seq OWNER TO postgres;

--
-- Name: tbl_users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_users_user_id_seq OWNED BY public.tbl_users.user_id;


--
-- Name: tbl_audit_log audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_audit_log ALTER COLUMN audit_id SET DEFAULT nextval('public.tbl_audit_log_audit_id_seq'::regclass);


--
-- Name: tbl_author author_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_author ALTER COLUMN author_id SET DEFAULT nextval('public.tbl_author_author_id_seq'::regclass);


--
-- Name: tbl_book_issue issue_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_book_issue ALTER COLUMN issue_id SET DEFAULT nextval('public.book_issue_issue_id_seq'::regclass);


--
-- Name: tbl_books book_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_books ALTER COLUMN book_id SET DEFAULT nextval('public.tbl_books_book_id_seq'::regclass);


--
-- Name: tbl_categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_categories ALTER COLUMN category_id SET DEFAULT nextval('public.tbl_categories_category_id_seq'::regclass);


--
-- Name: tbl_contactus contact_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_contactus ALTER COLUMN contact_id SET DEFAULT nextval('public.tbl_contactus_contact_id_seq'::regclass);


--
-- Name: tbl_demo u_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_demo ALTER COLUMN u_id SET DEFAULT nextval('public.tbl_demo_u_id_seq'::regclass);


--
-- Name: tbl_image image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_image ALTER COLUMN image_id SET DEFAULT nextval('public.tbl_image_image_id_seq'::regclass);


--
-- Name: tbl_login_audit login_audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_login_audit ALTER COLUMN login_audit_id SET DEFAULT nextval('public.tbl_login_audit_login_audit_id_seq'::regclass);


--
-- Name: tbl_permissions permission_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_permissions ALTER COLUMN permission_id SET DEFAULT nextval('public.tbl_permissions_permission_id_seq'::regclass);


--
-- Name: tbl_role_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_role_permission ALTER COLUMN id SET DEFAULT nextval('public.tbl_role_permission_id_seq'::regclass);


--
-- Name: tbl_roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_roles ALTER COLUMN role_id SET DEFAULT nextval('public.tbl_roles_role_id_seq'::regclass);


--
-- Name: tbl_user_role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_user_role ALTER COLUMN id SET DEFAULT nextval('public.tbl_user_role_id_seq'::regclass);


--
-- Name: tbl_users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users ALTER COLUMN user_id SET DEFAULT nextval('public.tbl_users_user_id_seq'::regclass);


--
-- Data for Name: fine_day; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fine_day ("?column?") FROM stdin;
4 days
24 days
\.


--
-- Data for Name: tbl_audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_audit_log (audit_id, user_id, action, module, description, created_at) FROM stdin;
6	2	create	Issue	Issued book	2026-02-27 04:29:10.679953
7	2	return	Book Return	Book returned	2026-02-27 04:29:57.084466
8	2	create	Issue	Issued book	2026-02-27 04:31:40.044918
9	2	update	AUTHOR	Author Updated	2026-02-27 04:43:17.220436
10	2	update	AUTHOR	Author Updated	2026-02-27 04:43:31.317804
11	2	update	AUTHOR	Author Updated	2026-02-27 05:29:12.379673
12	2	create	BOOK	Create new book	2026-02-27 05:47:17.162632
13	2	create	CATEGORY	Create new Category	2026-02-27 06:34:57.15065
14	2	create	Image	Image Upload	2026-02-27 09:10:10.054339
15	2	create	Image	Image Upload	2026-02-27 09:15:23.646742
16	2	create	Image	Image Upload	2026-02-27 09:17:30.574616
17	2	create	BOOK	Create new book	2026-03-02 04:39:38.184859
18	2	Update	CATEGORY	Updated Category	2026-03-02 04:41:18.946197
19	2	Update	CATEGORY	Updated Category	2026-03-02 04:41:27.841186
20	2	Update	CATEGORY	Updated Category	2026-03-02 04:41:35.067668
21	2	Update	CATEGORY	Updated Category	2026-03-02 04:41:39.909126
22	2	Update	CATEGORY	Updated Category	2026-03-02 04:41:48.438231
23	2	deleted	CATEGORY	deleted Category	2026-03-02 04:41:55.707502
24	2	create	CATEGORY	Create new Category	2026-03-02 04:42:09.946742
25	2	update	AUTHOR	Author Updated	2026-03-02 04:42:37.642679
26	2	create	AUTHOR	Create new Author	2026-03-02 04:42:51.546063
27	2	deleted	AUTHOR	Author Deleted	2026-03-02 04:42:55.226731
28	2	create	Image	Image Upload	2026-03-02 04:44:46.593015
29	2	update	AUTHOR	Author Updated	2026-03-02 12:09:51.690488
30	2	update	AUTHOR	Author Updated	2026-03-20 05:47:58.828533
31	2	create	AUTHOR	Create new Author	2026-03-20 05:48:08.749221
32	2	deleted	AUTHOR	Author Deleted	2026-03-20 06:36:29.97422
33	2	deleted	AUTHOR	Author Deleted	2026-03-20 06:40:15.402045
34	2	update	AUTHOR	Author Updated	2026-03-20 07:10:32.869712
35	2	update	AUTHOR	Author Updated	2026-03-20 07:10:44.649258
36	2	create	AUTHOR	Create new Author	2026-03-20 07:10:55.373316
37	2	update	AUTHOR	Author Updated	2026-03-20 07:14:10.330842
38	2	update	AUTHOR	Author Updated	2026-03-20 08:12:19.147859
39	2	update	AUTHOR	Author Updated	2026-03-20 08:13:31.644134
40	2	update	AUTHOR	Author Updated	2026-03-20 08:18:24.509082
41	2	update	AUTHOR	Author Updated	2026-03-20 08:18:27.755077
42	2	update	AUTHOR	Author Updated	2026-03-20 08:18:33.799201
43	2	update	AUTHOR	Author Updated	2026-03-20 08:19:10.715493
44	2	update	AUTHOR	Author Updated	2026-03-20 08:19:16.725349
45	2	create	AUTHOR	Create new Author	2026-03-20 08:19:32.506003
46	2	update	AUTHOR	Author Updated	2026-03-20 08:21:45.736356
47	2	create	Image	Image Upload	2026-03-25 10:49:16.102161
48	2	create	Image	Image Upload	2026-03-25 10:52:11.876961
49	2	create	Image	Image Upload	2026-03-25 10:52:51.517844
50	2	delete	Image	Image Deleted	2026-03-25 10:53:21.116187
51	2	delete	Image	Image Deleted	2026-03-25 10:53:23.144206
52	2	delete	Image	Image Deleted	2026-03-25 10:53:25.207225
53	2	delete	Image	Image Deleted	2026-03-25 10:53:26.718357
54	2	create	Image	Image Upload	2026-03-25 10:54:34.46164
55	2	create	Image	Image Upload	2026-03-25 10:56:18.161093
56	2	create	Image	Image Upload	2026-03-25 11:31:41.050617
57	2	create	Image	Image Upload	2026-03-25 11:32:10.150268
58	2	return	Book Return	Book returned	2026-03-26 11:07:56.889175
59	2	deleted	BOOK	book deleted	2026-03-26 11:48:38.559551
60	2	deleted	CATEGORY	deleted Category	2026-03-26 11:48:52.061625
61	2	deleted	AUTHOR	Author Deleted	2026-03-26 11:58:53.385141
62	2	create	AUTHOR	Create new Author	2026-03-26 11:58:58.775841
63	2	update	AUTHOR	Author Updated	2026-03-26 12:05:06.799583
64	2	Update	CATEGORY	Updated Category	2026-03-26 12:05:35.916267
65	2	Update	CATEGORY	Updated Category	2026-03-26 12:05:43.090222
66	2	Update	CATEGORY	Updated Category	2026-03-26 12:05:58.431798
67	2	Update	CATEGORY	Updated Category	2026-03-26 12:06:50.328335
68	2	Update	CATEGORY	Updated Category	2026-03-26 12:06:58.42965
69	2	create	CATEGORY	Create new Category	2026-03-26 12:14:06.552239
70	2	deleted	CATEGORY	deleted Category	2026-03-26 12:14:45.438803
71	2	create	CATEGORY	Create new Category	2026-03-26 12:14:53.433456
72	2	create	BOOK	Create new book	2026-03-26 12:16:21.899933
73	2	deleted	CATEGORY	deleted Category	2026-03-26 12:17:13.30196
74	2	deleted	CATEGORY	deleted Category	2026-03-26 12:17:19.188859
75	2	create	CATEGORY	Create new Category	2026-03-26 12:17:26.558044
76	2	Update	CATEGORY	Updated Category	2026-03-26 12:17:42.653519
77	2	deleted	CATEGORY	deleted Category	2026-03-27 04:42:40.039354
78	2	Update	CATEGORY	Updated Category	2026-03-27 05:59:06.970307
79	2	Update	CATEGORY	Updated Category	2026-03-27 05:59:13.097786
80	2	update	AUTHOR	Author Updated	2026-03-27 05:59:50.853402
81	2	create	AUTHOR	Create new Author	2026-03-27 05:59:55.988056
82	2	create	CATEGORY	Create new Category	2026-03-27 06:05:24.585635
83	2	deleted	CATEGORY	deleted Category	2026-03-27 06:06:05.811551
84	2	deleted	CATEGORY	deleted Category	2026-03-27 06:07:38.266636
85	2	Update	CATEGORY	Updated Category	2026-03-27 06:07:50.221427
\.


--
-- Data for Name: tbl_author; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_author (author_id, author_name, status, created_by, updated_by, created_at, updated_at, update_reason) FROM stdin;
2	max	deactivate	1	1	2026-02-20 04:09:02.974474	2026-02-26 10:43:47.558006	system
4	testing	deactivate	1	1	2026-03-02 04:42:51.539645	2026-03-02 04:42:55.216768	system
5	mike	deactivate	1	1	2026-03-20 05:48:08.738556	2026-03-20 06:36:29.961546	system
3	maxx	deactivate	1	1	2026-02-27 04:05:37.789105	2026-03-20 06:40:15.393861	system
6	Mike	active	1	1	2026-03-20 07:10:55.365865	2026-03-20 07:14:10.322058	system
7	Maxx	deactivate	1	1	2026-03-20 08:19:32.491394	2026-03-26 11:58:53.377778	system
8	Max	active	1	1	2026-03-26 11:58:58.759238	\N	system
1	will	active	1	1	2026-02-20 04:08:51.278952	2026-03-27 05:59:50.845764	system
9	Niru	active	1	1	2026-03-27 05:59:55.980457	\N	system
\.


--
-- Data for Name: tbl_book_issue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_book_issue (issue_id, user_id, book_id, issue_date, due_date, return_date, status, fine) FROM stdin;
3	2	4	2026-02-27 00:00:00	2026-03-06 09:59:10.63535	\N	ISSUED	0
1	1	1	2026-02-27 00:00:00	2026-03-06 09:54:37.264339	2026-02-27 04:29:57.07907	RETURNED	0
4	2	1	2026-02-27 00:00:00	2026-03-06 10:01:40.035403	\N	ISSUED	0
5	2	1	2026-03-03 00:00:00	2026-03-06 10:01:40.035403	\N	ISSUED	0
2	1	4	2026-02-07 00:00:00	2026-02-16 09:54:43.454495	2026-03-26 11:07:56.881115	RETURNED	0
\.


--
-- Data for Name: tbl_books; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_books (book_id, book_name, category_id, author_id, copies, status, created_by, updated_by, created_at, updated_at, update_reason, book_page, avl_qty) FROM stdin;
1	Book1	1	2	100	active	1	1	2026-02-26 04:37:51.795473	2026-02-26 04:37:51.795473	system	100	99
2	Book2	2	2	10	active	1	1	2026-02-26 04:38:19.314413	2026-02-26 04:38:19.314413	system	200	10
3	Book3	3	1	40	active	1	1	2026-02-26 04:38:40.365991	2026-02-26 04:38:40.365991	system	12	40
5	stroy5	2	1	50	active	1	1	2026-02-27 05:47:16.838467	2026-02-27 05:47:16.838467	system	100	50
4	Book4	5	2	100	active	1	1	2026-02-26 04:39:37.263327	2026-02-26 04:39:37.263327	system	100	99
6	stroy6	3	3	20	active	1	1	2026-03-02 04:39:38.099257	2026-03-26 11:48:38.535759	system	200	20
7	Book7	3	6	100	active	1	1	2026-03-26 12:16:21.869057	2026-03-26 12:16:21.869057	system	100	100
\.


--
-- Data for Name: tbl_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_categories (category_id, category_name, status, created_by, updated_by, created_at, updated_at, update_reason) FROM stdin;
3	sadd	active	1	1	2026-02-20 04:08:34.483054	2026-03-02 04:41:39.899533	system
4	history	active	1	1	2026-02-20 04:08:41.463706	2026-03-02 04:41:48.428394	system
5	Fiction	active	1	1	2026-02-20 04:39:00.083108	2026-02-26 10:44:00.002907	system
6	test	deactive	1	1	2026-02-27 06:34:57.134447	2026-03-26 12:14:45.431408	system
7	testing	deactive	1	1	2026-03-02 04:42:09.939041	2026-03-26 12:17:13.294753	system
12	Testt	deactive	1	1	2026-03-26 12:14:53.426638	2026-03-26 12:17:19.181121	system
11	Niru	deactive	1	1	2026-03-26 12:14:06.544884	2026-03-27 04:42:40.029971	system
1	Funyy	active	1	1	2026-02-20 04:08:21.040608	2026-03-27 05:59:06.939852	system
16	H	deactive	1	1	2026-03-27 06:05:24.580064	2026-03-27 06:06:05.801632	system
13	English	deactive	1	1	2026-03-26 12:17:26.551957	2026-03-27 06:07:38.259304	system
2	lovee	active	1	1	2026-02-20 04:08:27.557007	2026-03-27 06:07:50.214315	system
\.


--
-- Data for Name: tbl_contactus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_contactus (contact_id, contact_name, contact_email, contact_msg) FROM stdin;
1	nirupa	nirupakutana2gmail.com	helloo..!testingg
2	sujal	sujal@gmail.com	testinnggg
3	niruuu	niruu@gmail.com	dnjkefjk
\.


--
-- Data for Name: tbl_demo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_demo (u_id, u_name, u_email) FROM stdin;
1	nirupa	nirupa@gmail.com
2	testing	test@gmail.com
\.


--
-- Data for Name: tbl_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_image (image_id, image_file, image_name, image_pdf) FROM stdin;
1	demo/book1.jfif	Testingg	demo/OneMart_Ecommerce_Frontend (1) (1).pdf
2	demo/book5.jfif	Again test	demo/OneMart_Ecommerce_Frontend (1).pdf
3	demo/book8.jfif	Testting	demo/Definition E-Healthcare Management System.pdf
4	demo/book10.jfif	Testtt	demo/2123_ds_asm2.pdf
\.


--
-- Data for Name: tbl_login_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_login_audit (login_audit_id, email, user_id, activity_type, status, created_at) FROM stdin;
1	kutananirupa@gmail.com	1	REGISTATION	REGISTER SUCCESSFULLY	2026-02-27 04:23:12.811229
2	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-02-27 04:23:39.963473
3	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-02-27 04:24:16.287028
4	nirupakutana@gmail.com	2	REGISTATION	REGISTER SUCCESSFULLY	2026-02-27 04:27:43.334444
5	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-02-27 04:28:21.194379
6	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-02-27 04:28:46.797569
7	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-02-27 06:08:15.360985
8	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-02-27 08:59:26.561139
9	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-03 15:53:20.701285
10	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-10 06:31:01.451601
11	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-10 08:07:45.672665
12	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-10 08:16:47.400385
19	poojan@gmail.com	11	REGISTATION	LIBRARIAN REGISTER SUCCESSFULLY	2026-03-11 12:27:55.577622
20	vidhi@gmail.com	12	REGISTATION	LIBRARIAN REGISTER SUCCESSFULLY	2026-03-11 12:28:13.302754
21	shruti@gmail.com	13	REGISTATION	LIBRARIAN REGISTER SUCCESSFULLY	2026-03-12 06:54:31.628716
22	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-12 06:55:12.595078
23	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-16 06:15:33.89963
24	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-16 08:47:08.159834
25	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-16 08:47:17.754612
26	vidhi@gmail.com	12	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 03:54:54.54105
27	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 03:55:26.795824
28	parthivdudhrejiya42@gmail.com	14	REGISTATION	LIBRARIAN REGISTER SUCCESSFULLY	2026-03-17 03:56:00.453315
29	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 03:56:37.301615
30	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 03:57:09.872419
31	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:01:22.174037
32	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:02:09.331269
33	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 04:04:58.281155
34	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 04:05:41.641173
35	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:06:03.171995
36	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:06:40.640294
37	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:07:00.004357
38	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:08:54.488988
39	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:32:08.746289
40	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:37:07.839094
41	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 04:38:16.315738
42	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 05:34:51.789754
43	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 05:38:40.541689
44	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 05:50:35.076717
45	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 05:52:20.889746
46	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 05:54:57.222042
47	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 05:55:14.739257
48	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 06:34:38.371416
49	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 06:36:19.060087
50	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 06:36:48.931108
51	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 06:37:46.078035
52	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 12:00:29.736244
53	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 12:01:57.129936
54	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 12:02:34.707438
55	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 12:29:07.737224
56	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-17 12:29:41.250987
57	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 12:30:02.839027
58	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-17 12:36:42.348715
59	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 04:02:13.472879
60	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 04:29:10.070481
61	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-19 04:32:09.120959
62	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 04:32:17.644677
63	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 04:36:03.024648
64	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 05:54:56.843016
65	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 05:56:00.547723
66	NA	\N	LOGIN	FAILED_WRONG_EMAIL	2026-03-19 05:56:52.191081
67	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 05:57:07.202946
68	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-19 05:58:00.529255
69	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 05:58:28.654584
70	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-19 06:32:10.640168
71	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:32:24.504062
72	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-19 06:33:16.559156
73	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:33:25.522182
74	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:34:47.427111
75	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:36:09.072766
76	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:40:29.367826
77	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-19 06:41:37.251827
78	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:41:51.43307
79	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:42:03.746763
80	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:42:20.334103
81	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:42:38.719627
82	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:43:02.981858
83	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:47:44.067573
84	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:48:18.848338
85	NA	\N	LOGIN	FAILED_WRONG_EMAIL	2026-03-19 06:51:17.493421
86	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:51:24.768734
87	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-19 06:51:51.030726
88	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-20 04:32:07.828334
89	parthivdudhrejiya42@gmail.com	14	LOGIN	FAILED_WRONG_PASSWORD	2026-03-20 08:42:11.687729
90	parthivdudhrejiya42@gmail.com	14	LOGIN	LOGIN SUCCESSFULLY	2026-03-20 08:42:23.603832
91	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-20 08:42:50.139924
92	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-20 09:53:38.063915
93	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-24 03:51:49.788559
94	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 05:37:38.392511
95	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 05:41:34.087266
96	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 06:17:44.103908
97	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 06:20:26.86986
98	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 06:21:26.14069
99	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 10:30:22.872631
100	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 11:28:36.667752
101	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 11:31:12.171116
102	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 11:32:43.665976
103	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 11:41:42.436437
104	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-25 11:47:25.117951
105	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 04:18:44.000317
106	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 04:19:21.358621
107	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 04:39:24.75983
108	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 04:40:02.363461
109	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 05:05:48.616553
110	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 05:07:19.807935
111	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 05:09:26.487382
112	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 05:10:27.916777
113	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-26 05:36:46.170541
114	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 05:36:54.819063
115	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 05:39:15.556014
116	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 06:25:12.65866
117	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 06:52:59.061049
118	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 09:25:53.733691
119	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 09:39:05.165998
120	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 09:43:19.885063
121	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 10:26:15.720224
122	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 10:30:36.211829
123	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 10:48:19.812313
124	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 10:55:54.370677
125	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 11:07:29.568651
126	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 11:09:28.16193
127	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 11:13:22.875647
128	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-26 11:53:10.569151
129	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 04:23:47.307564
130	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:09:16.316788
131	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:27:36.114593
132	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:35:32.780167
133	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:38:33.533305
134	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:40:45.542031
135	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:44:43.979412
136	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 06:53:59.845472
137	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 07:03:26.240324
138	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 08:11:13.261439
139	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 08:38:24.488589
140	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 08:45:35.651078
141	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 10:29:03.065625
142	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 10:30:00.62805
143	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-27 12:02:21.417464
144	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-27 12:02:22.259059
145	kutananirupa@gmail.com	1	LOGIN	FAILED_WRONG_PASSWORD	2026-03-27 12:02:32.216521
146	nirupakutana@gmail.com	2	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 12:04:27.709973
147	kutananirupa@gmail.com	1	LOGIN	LOGIN SUCCESSFULLY	2026-03-27 12:05:48.172411
\.


--
-- Data for Name: tbl_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_permissions (permission_id, permission_name, description) FROM stdin;
3	AddCategory	can add Category
1	AddBook	Librarian can add Book
2	AddAuthor	emlpoyee cann
7	ViewBook	any one can view book
8	ViewCategory	Any one can view
9	ViewAuthor	Any one can view
10	UpdateBook	Can update
13	DeleteCategory	Can DELETE
4	DeleteBook	Can Delete Book
17	ViewUsers	Can view user list
18	IssueBook	Issue Book to Librarian
19	ViewAudit	Can view Audits
20	ViewLoginAudit	can view Login Audit
11	UpdeteCategory	Can update
12	UpdateAuthor	Can update
14	DeleteAuthor	Can Delete
22	AddImage	Can add Image of Book
\.


--
-- Data for Name: tbl_role_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_role_permission (id, role_id, permission_id, is_active) FROM stdin;
4	3	7	t
5	3	8	t
6	3	9	t
7	3	2	t
10	3	10	t
11	3	11	t
12	3	12	t
13	3	14	t
14	3	13	t
15	3	4	t
16	1	7	t
17	1	8	t
18	1	9	t
22	1	10	t
2	2	8	t
3	2	9	t
35	3	18	t
36	3	17	t
19	1	2	t
8	3	1	t
21	1	3	t
24	1	12	t
23	1	11	t
25	1	14	t
32	1	19	t
33	1	20	t
31	1	18	t
30	1	17	t
27	1	4	t
26	1	13	t
20	1	1	t
9	3	3	t
1	2	7	t
37	1	22	t
\.


--
-- Data for Name: tbl_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_roles (role_id, role_name, description) FROM stdin;
1	ADMIN	System Administrator
2	USER	Vier or General User
3	LIBRARIAN	LIBRARY MANAGER
\.


--
-- Data for Name: tbl_user_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_user_role (id, user_id, role_id) FROM stdin;
1	1	1
3	2	2
4	11	3
5	12	3
6	13	3
7	14	3
\.


--
-- Data for Name: tbl_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_users (user_id, user_name, user_email, user_password, is_active, count, duration, role, email_token, token_created_at) FROM stdin;
11	poojan	poojan@gmail.com	pbkdf2_sha256$600000$JShlrCcVqYp6sR3QRhgD7F$KfT4Il5EHM0nntDjZW41nor8zmzdE+58DmrbkeVx8mk=	f	1	\N	LIBRARIAN	5648aadb-6ff4-4c09-be9e-99a44c93dcf2	2026-03-11 12:27:55.568729
12	vidhii	vidhi@gmail.com	pbkdf2_sha256$600000$r3wSsUhTpygWRYEFYzJ4w4$yvkq3XkIUOBsOacGcJ24MIz5IiD7LyXS155FtxZA2S4=	t	2	\N	LIBRARIAN	35f5d48c-2a01-45ef-9b3e-69be0c569945	2026-03-11 12:28:13.29701
13	shruti	shruti@gmail.com	pbkdf2_sha256$600000$burXznTmIJ0xTeY3VtoeDr$zIoHfiLgTm/oaKs0cSulWjEyQOyo6EiAnC23VKBGV6s=	t	1	\N	LIBRARIAN	1d8cd3fd-b231-499e-a5f9-232ff50cf0b3	2026-03-12 06:54:31.617626
14	parthiv	parthivdudhrejiya42@gmail.com	pbkdf2_sha256$600000$ljDWeZg9WjlhvUdPWwALWM$ZVadfiPjdc/WVMONU2swXQdCF9U0/X2rOuo1/VnnRoM=	t	0	\N	LIBRARIAN	41e7c928-a142-4939-9376-77011a7a0830	2026-03-17 03:56:00.423427
2	Nirupa	nirupakutana@gmail.com	pbkdf2_sha256$600000$EdPTGcE8e8tRs8m8CIoEdL$XIgopsIRIeu+rPwBiIWW1RBndTZw77pXUVS7RBjl85E=	t	0	\N	USER	\N	2026-02-27 04:27:43.33268
1	Niru	kutananirupa@gmail.com	pbkdf2_sha256$600000$VOTWm2WJTERYL9MFLDQUtt$j5mt0OSO/EvsbBlmrW5BllH5O75hC7sl7FBMA97BJ5M=	t	0	\N	ADMIN	\N	2026-02-27 04:23:12.804656
\.


--
-- Name: book_issue_issue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.book_issue_issue_id_seq', 5, true);


--
-- Name: tbl_audit_log_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_audit_log_audit_id_seq', 85, true);


--
-- Name: tbl_author_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_author_author_id_seq', 9, true);


--
-- Name: tbl_books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_books_book_id_seq', 7, true);


--
-- Name: tbl_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_categories_category_id_seq', 16, true);


--
-- Name: tbl_contactus_contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_contactus_contact_id_seq', 3, true);


--
-- Name: tbl_demo_u_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_demo_u_id_seq', 2, true);


--
-- Name: tbl_image_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_image_image_id_seq', 4, true);


--
-- Name: tbl_login_audit_login_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_login_audit_login_audit_id_seq', 147, true);


--
-- Name: tbl_permissions_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_permissions_permission_id_seq', 22, true);


--
-- Name: tbl_role_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_role_permission_id_seq', 37, true);


--
-- Name: tbl_roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_roles_role_id_seq', 3, true);


--
-- Name: tbl_user_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_user_role_id_seq', 7, true);


--
-- Name: tbl_users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_users_user_id_seq', 15, true);


--
-- Name: tbl_book_issue book_issue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_book_issue
    ADD CONSTRAINT book_issue_pkey PRIMARY KEY (issue_id);


--
-- Name: tbl_audit_log tbl_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_audit_log
    ADD CONSTRAINT tbl_audit_log_pkey PRIMARY KEY (audit_id);


--
-- Name: tbl_author tbl_author_author_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_author
    ADD CONSTRAINT tbl_author_author_name_key UNIQUE (author_name);


--
-- Name: tbl_author tbl_author_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_author
    ADD CONSTRAINT tbl_author_pkey PRIMARY KEY (author_id);


--
-- Name: tbl_books tbl_books_book_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_books
    ADD CONSTRAINT tbl_books_book_name_key UNIQUE (book_name);


--
-- Name: tbl_books tbl_books_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_books
    ADD CONSTRAINT tbl_books_pkey PRIMARY KEY (book_id);


--
-- Name: tbl_categories tbl_categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categories_category_name_key UNIQUE (category_name);


--
-- Name: tbl_categories tbl_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_categories
    ADD CONSTRAINT tbl_categories_pkey PRIMARY KEY (category_id);


--
-- Name: tbl_contactus tbl_contactus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_contactus
    ADD CONSTRAINT tbl_contactus_pkey PRIMARY KEY (contact_id);


--
-- Name: tbl_demo tbl_demo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_demo
    ADD CONSTRAINT tbl_demo_pkey PRIMARY KEY (u_id);


--
-- Name: tbl_image tbl_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_image
    ADD CONSTRAINT tbl_image_pkey PRIMARY KEY (image_id);


--
-- Name: tbl_login_audit tbl_login_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_login_audit
    ADD CONSTRAINT tbl_login_audit_pkey PRIMARY KEY (login_audit_id);


--
-- Name: tbl_permissions tbl_permissions_permission_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_permissions
    ADD CONSTRAINT tbl_permissions_permission_name_key UNIQUE (permission_name);


--
-- Name: tbl_permissions tbl_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_permissions
    ADD CONSTRAINT tbl_permissions_pkey PRIMARY KEY (permission_id);


--
-- Name: tbl_role_permission tbl_role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_role_permission
    ADD CONSTRAINT tbl_role_permission_pkey PRIMARY KEY (id);


--
-- Name: tbl_role_permission tbl_role_permission_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_role_permission
    ADD CONSTRAINT tbl_role_permission_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: tbl_roles tbl_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_roles_pkey PRIMARY KEY (role_id);


--
-- Name: tbl_roles tbl_roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_roles
    ADD CONSTRAINT tbl_roles_role_name_key UNIQUE (role_name);


--
-- Name: tbl_user_role tbl_user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_user_role
    ADD CONSTRAINT tbl_user_role_pkey PRIMARY KEY (id);


--
-- Name: tbl_user_role tbl_user_role_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_user_role
    ADD CONSTRAINT tbl_user_role_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: tbl_users tbl_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT tbl_users_pkey PRIMARY KEY (user_id);


--
-- Name: tbl_users tbl_users_user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT tbl_users_user_email_key UNIQUE (user_email);


--
-- Name: tbl_book_issue book_issue_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_book_issue
    ADD CONSTRAINT book_issue_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.tbl_books(book_id);


--
-- Name: tbl_book_issue book_issue_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_book_issue
    ADD CONSTRAINT book_issue_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tbl_users(user_id);


--
-- Name: tbl_audit_log tbl_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_audit_log
    ADD CONSTRAINT tbl_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tbl_users(user_id) ON DELETE CASCADE;


--
-- Name: tbl_books tbl_books_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_books
    ADD CONSTRAINT tbl_books_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.tbl_author(author_id);


--
-- Name: tbl_books tbl_books_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_books
    ADD CONSTRAINT tbl_books_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.tbl_categories(category_id);


--
-- Name: tbl_login_audit tbl_login_audit_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_login_audit
    ADD CONSTRAINT tbl_login_audit_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tbl_users(user_id) ON DELETE CASCADE;


--
-- Name: tbl_role_permission tbl_role_permission_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_role_permission
    ADD CONSTRAINT tbl_role_permission_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.tbl_permissions(permission_id) ON DELETE CASCADE;


--
-- Name: tbl_role_permission tbl_role_permission_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_role_permission
    ADD CONSTRAINT tbl_role_permission_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.tbl_roles(role_id) ON DELETE CASCADE;


--
-- Name: tbl_user_role tbl_user_role_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_user_role
    ADD CONSTRAINT tbl_user_role_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.tbl_roles(role_id) ON DELETE CASCADE;


--
-- Name: tbl_user_role tbl_user_role_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_user_role
    ADD CONSTRAINT tbl_user_role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tbl_users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict sMOwZTadJLybjgRXWlfAgCq5QD9EFbt2dQfzsP12izRpNC6vQiiIs0PabkrEbwH

