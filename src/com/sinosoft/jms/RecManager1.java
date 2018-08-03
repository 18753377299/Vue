package com.sinosoft.jms;

public class RecManager1 {
	public static void main(String[] args) {

		new RecMain("fcfk0001", "fcfk0001", "10.10.1.246", 11428, "RECVQCHANNEL1", 819, "QMG_A", 1, "QCFCFKTOFCFK")
				.start();
		
//		new RecMain("fcfk0001", "fcfk0001", "10.10.1.247", 11428, "RECVQCHANNEL1", 819, "QMG_B", 1, "QCFCFKTOFCFK")
//		.start();

	}
}
