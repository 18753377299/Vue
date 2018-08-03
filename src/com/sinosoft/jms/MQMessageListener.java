package com.sinosoft.jms;

import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import net.sf.json.JSONObject;


public class MQMessageListener implements MessageListener {
	private JMSContext context ;

	public MQMessageListener(JMSContext context){
		this.context = context ;
	}
	
	@Override
	public void onMessage(Message message) {
		TextMessage textMsg = (TextMessage) message;  
	      try {
	        	//业务处理失败，回滚次数超过MQ系统设定的次数（默认是5次），自动将消息转发到错误队列
	        	boolean ret = true ;
//	        	System.out.println("收到消息：");
//	        	System.out.println("收到消息："+textMsg.getText());
	        	//if(textMsg.getText().length()>100000)        ret=true;
	        	if(!ret){
	        		System.out.println("业务处理失败,消息回滚");
	        		//根据错误类型等待（错误类/异常类）add by zhanglongsheng 2016-10-17
	        		//Thread.sleep(Constants.ERROR_WAITMILLS) ;
	        		//Thread.sleep(Constants.EXPCEPTION_WAITMILLS) ;
	        		context.rollback();
	        	}else{
	        		System.out.println("收到消息："+textMsg.getText());
	        		JSONObject jsonObject=JSONObject.fromObject(textMsg.getText().toString());
	        		System.out.println(jsonObject.get("path"));
	        		System.out.println(jsonObject.get("archivesNo"));
	        		context.commit();
	        	}
	        } catch (Exception e) {  
	        	e.printStackTrace();  
	        } 
	}
	
	
	/**
	 * 非事务  (MessageListener 接口中的方法)
	 */
//	@Override
//	public void onMessage(Message m) {
//		TextMessage textMsg = (TextMessage) m;  
//        try {
//        	System.out.println("收到消息："+textMsg.getText());
//        } catch (Exception e) {  
//        	e.printStackTrace();  
//        } 
//
//	}

}
