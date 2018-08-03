package com.sinosoft.jms;

import javax.jms.Destination;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.json.JSONObject;

import com.ibm.mq.jms.MQQueueConnectionFactory;

/**
 * 消息发送事务：
 * ①不使用：不需要commit；
 * ②使用：需要commit，否则接收不到
 * 
 * */

public class SendMain {

	public static void main(String[] args) {
		
		String userid = "fcfk0000";
		String password = "fcfk0000";
		
		
		//1、初始化连接工厂
		MQQueueConnectionFactory sendFactory = new MQQueueConnectionFactory();
		JMSContext context = null;
		try {
			sendFactory.setHostName("10.10.1.245");
			sendFactory.setPort(11428);
			sendFactory.setChannel("RECVQCHANNEL");
			sendFactory.setCCSID(819);
			sendFactory.setQueueManager("QMGWA");
			sendFactory.setTransportType(1);
		
//			context= sendFactory.createContext(userid,password,Session.AUTO_ACKNOWLEDGE);
			context= sendFactory.createContext(userid,password,Session.SESSION_TRANSACTED);
			Destination dest = context.createQueue("QAFCFKTOFCFK");
			
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("path","10.10.1.156");
			jsonObject.put("archivesNo","RC00300000000201800005");
			String json = jsonObject.toString();
			
			for(int i = 0; i<10; i++) {
				TextMessage message = context.createTextMessage(json + i);
				context.createProducer().send(dest, message);
				System.out.println("========  send success! =========   "+ message);
			}
			context.commit();
		} catch (JMSException e) {
			e.printStackTrace();
		} finally {
			if(null != context) {
				context.close();
			}
		}
	}
}
