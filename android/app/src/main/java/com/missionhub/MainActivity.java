package com.missionhub;

import com.facebook.react.ReactActivity;
import com.adobe.mobile.Config;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MissionHub";
    }

    @Override
    public void onResume() {
        super.onResume();

        Config.collectLifecycleData(this);
    }

    @Override
    public void onPause() {
        super.onPause();

        Config.pauseCollectingLifecycleData();
    }
}
