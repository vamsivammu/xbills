package com.xbillsapp;

import com.facebook.react.ReactActivity;
import androidx.multidex.MultiDex;

import android.content.Context;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
     @Override
  protected void attachBaseContext(Context base) {
     super.attachBaseContext(base);
     MultiDex.install(this);
  }
    @Override
    protected String getMainComponentName() {
        return "xbillsapp";
    }
}
