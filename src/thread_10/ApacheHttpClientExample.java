package thread_10;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.httpclient.HttpStatus;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectionKeepAliveStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultConnectionKeepAliveStrategy;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HttpContext;

public class ApacheHttpClientExample {

	private static final String USER_AGENT = "Mozilla/5.0";

	private static final String GET_URL = "http://10.10.1.156:8090/iserver/services/data-FXDT/rest/data/datasources/china/datasets/hail_hazard_scale_1km/gridValue.json?x=120.85419&y=29.81507";
    
	private static final String POST_URL = "http://localhost:9090/SpringMVCExample/home";

	public static void main(String[] args) throws IOException {
		sendGET();
		System.out.println("GET DONE");
//		sendPOST();
		System.out.println("POST DONE");
	}

	private static void sendGET() throws IOException {
		CloseableHttpClient httpClient=null;
		try {
			if(httpClient ==null){
				PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
	            // 连接池最大连接数  
	            cm.setMaxTotal(200);
	            // 单条链路最大连接数（一个ip+一个端口 是一个链路）  
	            cm.setDefaultMaxPerRoute(100);
	            // 指定某条链路的最大连接数  
	
	            ConnectionKeepAliveStrategy kaStrategy = new DefaultConnectionKeepAliveStrategy()
	            {
	                @Override
	                public long getKeepAliveDuration(HttpResponse response, HttpContext context)
	                {
	                    long keepAlive = super.getKeepAliveDuration(response, context);
	                    if (keepAlive == -1)
	                    {
	                        keepAlive = 60000;
	                    }
	                    return keepAlive;
	                }	
	            };
	
	            httpClient = HttpClients.custom().setConnectionManager(cm).setKeepAliveStrategy(kaStrategy).build();
			}
			
//			httpClient = HttpClients.createDefault();
			HttpGet httpGet = new HttpGet(GET_URL);
			httpGet.addHeader("User-Agent", USER_AGENT);
			CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
			System.out.println("GET Response Status:: "
					+ httpResponse.getStatusLine().getStatusCode());

			BufferedReader reader = new BufferedReader(new InputStreamReader(
					httpResponse.getEntity().getContent()));

			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = reader.readLine()) != null) {
				response.append(inputLine);
			}
			reader.close();

			// print result
			System.out.println(response.toString());
		} catch (UnsupportedOperationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(httpClient!=null){
			httpClient.close();
		}
		
	}

	private static void sendPOST() throws IOException {

		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(POST_URL);
		httpPost.addHeader("User-Agent", USER_AGENT);

		List<NameValuePair> urlParameters = new ArrayList<NameValuePair>();
		urlParameters.add(new BasicNameValuePair("userName", "Pankaj Kumar"));

		HttpEntity postParams = new UrlEncodedFormEntity(urlParameters);
		httpPost.setEntity(postParams);

		CloseableHttpResponse httpResponse = httpClient.execute(httpPost);
		if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
//			return StreamUtils.copyToString(method.getResponseBodyAsStream(), Charset.forName("utf-8"));
		}
		System.out.println("POST Response Status:: "
				+ httpResponse.getStatusLine().getStatusCode());

		BufferedReader reader = new BufferedReader(new InputStreamReader(
				httpResponse.getEntity().getContent()));

		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = reader.readLine()) != null) {
			response.append(inputLine);
		}
		reader.close();

		// print result
		System.out.println(response.toString());
		httpClient.close();

	}

}