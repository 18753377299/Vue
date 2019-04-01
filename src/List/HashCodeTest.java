package List;

import java.util.*;

public class HashCodeTest {  
  

  
    public static void main(String[] args){  


        SessionInfo sessionInfo1 = new SessionInfo();
        SessionInfo sessionInfo2 = new SessionInfo();
        sessionInfo1.setId(1);
        sessionInfo2.setId(1);
        sessionInfo1.setUrl("test");
        sessionInfo2.setUrl("test");


        SessionInfo mSessionInfo = null;                    //实体类对象
        Set<SessionInfo> sessionList = new HashSet<SessionInfo>();  //声明set集合对象
//        final List<SessionInfo> list = new ArrayList<SessionInfo>();//声明list集合对象
        List<SessionInfo> list = new ArrayList<SessionInfo>();


        sessionList.add(sessionInfo1);//将对象添加到Set集合中
        sessionList.add(sessionInfo2);//将对象添加到Set集合中
        list.addAll(sessionList);//将数据添加到list集合对象

        for (int i = 0; i < list.size(); i++) {
            System.out.println(list.get(i));
        }

    }



}