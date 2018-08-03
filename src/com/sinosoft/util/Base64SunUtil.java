package com.sinosoft.util;

import java.io.IOException;
import java.nio.ByteBuffer;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
/**
 * Base64工具类
 * 
 */
@SuppressWarnings("restriction")
public final class Base64SunUtil {
	
	private Base64SunUtil(){}
	
	/**BASE64加密*/
	private static BASE64Encoder encoder;
	/**BASE64解密*/
	private static BASE64Decoder decoder;
	
	static{
		if(null == encoder)
			encoder = new BASE64Encoder();
		if(null == decoder)
			decoder = new BASE64Decoder();
	}
	
	
	//=================================加密=======================================
	
	/**
	 * 加密
	 * 
	 * @param bytes 字节数组
	 * @return BASE64加密字符串
	 */
	public static String encode(byte bytes[]){
	    return encoder.encode(bytes);
	}
	
	/**
	 * 加密
	 * 
	 * @param byteBuffer 字节缓冲区
	 * @return BASE64加密字符串
	 */
	public static String encode(ByteBuffer byteBuffer){
		return encoder.encode(byteBuffer);
	}
	
	/**
	 * 加密
	 * 
	 * @param bytes 字节数组
	 * @return BASE64加密字符串
	 */
	public static String encodeBuffer(byte bytes[]){
		return encoder.encodeBuffer(bytes);
	}
	
	/**
	 * 加密
	 * 
	 * @param byteBuffer 字节缓冲区
	 * @return BASE64加密字符串
	 */
	public static String encodeBuffer(ByteBuffer byteBuffer){
		return encoder.encodeBuffer(byteBuffer);
	}
	
	
	//=================================解密=======================================
    /**
	 * 解密
	 * 
     * @param str BASE64加密字符串
     * @return 字节数组
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
	 * 解密
	 * 
     * @param str BASE64加密字符串
     * @return 字节缓冲区
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
