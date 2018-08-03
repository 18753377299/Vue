package com.sinosoft.util;

import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

/**
 * 
 * 类描述： DES加密util
 * 版本号： v1.0
 */
public abstract class DesEncryptUtil{
	
	/**
	 * 根据参数生成KEY
	 * 
	 * @param strKey
	 */
	public static SecretKey getKey(String strKey) {
		SecretKey key = null ;
		try {
			
			//防止linux下 随机生成key
			SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");
			secureRandom.setSeed(strKey.getBytes());

			KeyGenerator _generator = KeyGenerator.getInstance("DES");
			_generator.init(secureRandom);
			key = _generator.generateKey();
			_generator = null;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return key ;
	}

	/**
	 * 加密String明文输入,String密文输出
	 * 
	 * @param strMing
	 * @param key
	 * @return
	 */
	public static String getEncString(String strMing, String key) {
		byte[] byteMi = null;
		byte[] byteMing = null;
		String strMi = "";
		try {
			byteMing = strMing.getBytes();
			byteMi = getEncCode(byteMing,key);
			strMi = Base64SunUtil.encode(byteMi);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			byteMing = null;
			byteMi = null;
		}
		return strMi;
	}

	
	/**
	 * 解密 以String密文输入,String明文输出
	 * 
	 * @param strMi
	 * @return
	 */
	public static String getDesString(String strMi, String key) {
		byte[] byteMing = null;
		byte[] byteMi = null;
		String strMing = "";
		try {
			byteMi = Base64SunUtil.decodeBuffer(strMi);
			byteMing = getDesCode(byteMi,key);
			strMing = new String(byteMing);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			byteMing = null;
			byteMi = null;
		}
		return strMing;
	}

	/**
	 * 加密以byte[]明文输入,byte[]密文输出
	 * 
	 * @param byteS
	 * @return
	 */
	private static byte[] getEncCode(byte[] byteS,String key) {
		byte[] byteFina = null;
		Cipher cipher;
		try {
			
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.ENCRYPT_MODE, getKey(key));
			byteFina = cipher.doFinal(byteS);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			cipher = null;
		}
		return byteFina;
	}

	/**
	 * 解密以byte[]密文输入,以byte[]明文输出
	 * 
	 * @param byteD
	 * @return
	 */
	private static byte[] getDesCode(byte[] byteD,String key) {
		Cipher cipher;
		byte[] byteFina = null;
		try {
			cipher = Cipher.getInstance("DES");
			cipher.init(Cipher.DECRYPT_MODE, getKey(key));
			byteFina = cipher.doFinal(byteD);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			cipher = null;
		}
		return byteFina;
	}

	
	/**
	 * main
	 * @param args
	 */
	public static void main(String args[]) {
//		String strEnc = getEncString("mq0002", "123456");// 加密字符串,返回String的密文
//		System.out.println("密文："+strEnc);
		String strDes = getDesString("m3l01iZHYpTgttTGMgG3QQ==", "fcfk0001");// 把String 类型的密文解密
		System.out.println("明文:"+strDes);
	}
}