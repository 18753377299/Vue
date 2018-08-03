package com.sinosoft.util;

import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

/**
 * 
 * �������� DES����util
 * �汾�ţ� v1.0
 */
public abstract class DesEncryptUtil{
	
	/**
	 * ���ݲ�������KEY
	 * 
	 * @param strKey
	 */
	public static SecretKey getKey(String strKey) {
		SecretKey key = null ;
		try {
			
			//��ֹlinux�� �������key
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
	 * ����String��������,String�������
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
	 * ���� ��String��������,String�������
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
	 * ������byte[]��������,byte[]�������
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
	 * ������byte[]��������,��byte[]�������
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
//		String strEnc = getEncString("mq0002", "123456");// �����ַ���,����String������
//		System.out.println("���ģ�"+strEnc);
		String strDes = getDesString("m3l01iZHYpTgttTGMgG3QQ==", "fcfk0001");// ��String ���͵����Ľ���
		System.out.println("����:"+strDes);
	}
}