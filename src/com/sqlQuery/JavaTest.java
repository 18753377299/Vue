package com.sqlQuery;

import com.supermap.data.Workspace;

public class JavaTest {
	public static void main(String[]args){
		System.out.println("before-success!");
		long start= System.currentTimeMillis();
		new Workspace();
		long end= System.currentTimeMillis();
		System.out.println("success-workspace!="+(end-start));
	}
}
