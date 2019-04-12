package arraycopy;
	/**
 * @author  作者 E-mail: liqiankun
 * @date 创建时间：2019年4月12日 上午11:06:52
 * @version 1.0 
 * @parameter 
 * @since   利用System.arraycopy实现数组复制的示例
 * @return  */
public class SsytemArrayCopy {
	
	public static void main(String[]args){
		
		User [] userSource = new User [] { new User("zhangsan","aaa"),new User("lisi","bbb")};
		User [] userTarget = new User [userSource.length];
		System.arraycopy(userSource, 0, userTarget, 0, userSource.length);
		
		System.out.println(userSource[0]==userTarget[0]?"浅复制":"深复制");
		
		for(User user : userTarget){
			System.out.println(user.getUser()+":"+user.getPass());
		}
		
		String [] source = new String [] {"aaa","bbb"};
		String [] target = new String [5];
		target[0] = "ddd";
		System.arraycopy(source,0,target,1,source.length);
		for(String user : target){
			System.out.println(user);
		}
		
	}
	
}

class User{
	
	/**用户名*/
	private String user;
	/**密码*/
	private String pass;
	
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public String getPass() {
		return pass;
	}
	public void setPass(String pass) {
		this.pass = pass;
	}
	
	public User() {
		super();
	}
	public User(String user, String pass) {
		super();
		this.user = user;
		this.pass = pass;
	}
}
