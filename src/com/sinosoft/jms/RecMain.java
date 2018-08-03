package com.sinosoft.jms;

import javax.jms.Destination;
import javax.jms.ExceptionListener;
import javax.jms.JMSConsumer;
import javax.jms.JMSContext;
import javax.jms.JMSException;
import javax.jms.Session;
import com.ibm.mq.jms.MQQueueConnectionFactory;

public class RecMain  implements ExceptionListener{
	/**
	 * 1、工场对象 ConnectionFactory ;
	 * 2、连接对象 Connection ;
	 * 3、会话对象 Session ;
	 * 4、生产者 MessageProducer ;
	 * 5、消费者 MessageConsumer ;
	 * 6、目的地 Destination ;
	 * 7、上下文 JMSContext;
	 */
	private JMSContext context;
	private String userid;
	private String password;
	private String host;
	private int  port;
	private String  channel;
	private int  ccsid;
	private String  queueManager;
	private int  transportType;
	private String queue;

	@Override
	public void onException(JMSException arg0) {
		System.out.println(arg0);
	}
	
	public RecMain() {
		super();
	}

	public String getUserid() {
		return userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public int getCcsid() {
		return ccsid;
	}

	public void setCcsid(int ccsid) {
		this.ccsid = ccsid;
	}

	public String getQueueManager() {
		return queueManager;
	}

	public void setQueueManager(String queueManager) {
		this.queueManager = queueManager;
	}

	public int getTransportType() {
		return transportType;
	}

	public void setTransportType(int transportType) {
		this.transportType = transportType;
	}

	public String getQueue() {
		return queue;
	}

	public void setQueue(String queue) {
		this.queue = queue;
	}

	public RecMain(String userid, String password, String host, int port, String channel, int ccsid,
			String queueManager, int transportType, String queue) {
		super();
		this.userid = userid;
		this.password = password;
		this.host = host;
		this.port = port;
		this.channel = channel;
		this.ccsid = ccsid;
		this.queueManager = queueManager;
		this.transportType = transportType;
		this.queue = queue;
		
		MQQueueConnectionFactory recvFactory = new MQQueueConnectionFactory();
		JMSConsumer consumer = null;
		try {
			recvFactory.setHostName(this.host);
			recvFactory.setPort(this.port);
			recvFactory.setChannel(this.channel);
			recvFactory.setCCSID(this.ccsid);
			recvFactory.setQueueManager(this.queueManager);
			recvFactory.setTransportType(this.transportType);
			// 无事务方式  add by liqiankun
//			context= recvFactory.createContext(userid,password,Session.AUTO_ACKNOWLEDGE);
			// 开启事务
			context= recvFactory.createContext(userid,password,Session.SESSION_TRANSACTED);
			
			context.setAutoStart(false) ;
			Destination dest = context.createQueue(this.queue);
			consumer = context.createConsumer(dest);
			context.setExceptionListener(this);
			consumer.setMessageListener(new MQMessageListener(context)) ;
		} catch (JMSException e) {
			e.printStackTrace();
		}
	}
	
	public void start() {
		context.start();
		try {
			Thread.sleep(1000000L) ;
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void release() {
		context.close();
	}

}
