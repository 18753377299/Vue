package com.sinosoft.util;

import java.io.IOException;
import java.nio.ByteBuffer;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
/**
 * Base64������
 * 
 */
@SuppressWarnings("restriction")
public final class Base64SunUtil {
	
	private Base64SunUtil(){}
	
	/**BASE64����*/
	private static BASE64Encoder encoder;
	/**BASE64����*/
	private static BASE64Decoder decoder;
	
	static{
		if(null == encoder)
			encoder = new BASE64Encoder();
		if(null == decoder)
			decoder = new BASE64Decoder();
	}
	
	
	//=================================����=======================================
	
	/**
	 * ����
	 * 
	 * @param bytes �ֽ�����
	 * @return BASE64�����ַ���
	 */
	public static String encode(byte bytes[]){
	    return encoder.encode(bytes);
	}
	
	/**
	 * ����
	 * 
	 * @param byteBuffer �ֽڻ�����
	 * @return BASE64�����ַ���
	 */
	public static String encode(ByteBuffer byteBuffer){
		return encoder.encode(byteBuffer);
	}
	
	/**
	 * ����
	 * 
	 * @param bytes �ֽ�����
	 * @return BASE64�����ַ���
	 */
	public static String encodeBuffer(byte bytes[]){
		return encoder.encodeBuffer(bytes);
	}
	
	/**
	 * ����
	 * 
	 * @param byteBuffer �ֽڻ�����
	 * @return BASE64�����ַ���
	 */
	public static String encodeBuffer(ByteBuffer byteBuffer){
		return encoder.encodeBuffer(byteBuffer);
	}
	
	
	//=================================����=======================================
    /**
	 * ����
	 * 
     * @param str BASE64�����ַ���
     * @return �ֽ�����
     * @
     */
    public static byte[] decodeBuffer(String str){
        try {
			return decoder.decodeBuffer(str);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
    }

    /**
	 * ����
	 * 
     * @param str BASE64�����ַ���
     * @return �ֽڻ�����
     * @
     */
    public static ByteBuffer decodeBufferToByteBuffer(String str) {
        try {
			return decoder.decodeBufferToByteBuffer(str);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
    }
    
    public static void main(String[] args) {
    	System.out.println(new String(decodeBuffer("ZmNmazAwMDE=")));
	}

}
