
package com.mycompany.sparktest;
import static spark.Spark.*;

public class HelloWorld {
    public static void main(String[] args){
    get("/testFrame", (req, res) -> "Hello World Test");
    TestFrame frame=new TestFrame();
    
    frame.setVisible(true);
    }
    
}
