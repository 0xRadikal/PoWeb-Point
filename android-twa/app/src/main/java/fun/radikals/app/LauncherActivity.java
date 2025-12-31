package fun.radikals.app;

import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

public class LauncherActivity extends com.google.androidbrowserhelper.trusted.LauncherActivity {

    private static final String TAG = "LauncherActivity";

    // ABH meta-data keys
    private static final String META_DEFAULT_URL_SUPPORT =
            "android.support.customtabs.trusted.DEFAULT_URL";
    private static final String META_DEFAULT_URL_ANDROIDX =
            "androidx.browser.trusted.DEFAULT_URL";

    // Last-resort fallback (never null)
    private static final String HARD_FALLBACK_URL = "https://radikals.fun/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep your orientation logic (as requested)
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.O) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        }
    }

    @Override
    protected Uri getLaunchingUrl() {
        // Do NOT call super.getLaunchingUrl() without guarding:
        // ABH can crash if DEFAULT_URL is missing/null.
        String url = firstNonBlank(
                readActivityMetaDataString(META_DEFAULT_URL_SUPPORT),
                readActivityMetaDataString(META_DEFAULT_URL_ANDROIDX),
                safeGetString(R.string.launchUrl),
                HARD_FALLBACK_URL
        );

        Uri uri = safeParseHttpUrl(url);
        if (uri == null) {
            uri = Uri.parse(HARD_FALLBACK_URL);
        }

        Log.i(TAG, "Launching URL = " + uri);
        return uri;
    }

    private String readActivityMetaDataString(String key) {
        try {
            ActivityInfo ai = getPackageManager().getActivityInfo(
                    getComponentName(),
                    PackageManager.GET_META_DATA
            );
            Bundle md = ai.metaData;
            if (md == null) return null;

            Object v = md.get(key);
            if (v == null) return null;

            // If value is a resource id, resolve it.
            if (v instanceof Integer) {
                return trimToNull(getString((Integer) v));
            }

            // Otherwise treat it as a string
            return trimToNull(String.valueOf(v));
        } catch (Throwable t) {
            Log.w(TAG, "Failed reading meta-data: " + key, t);
            return null;
        }
    }

    private String safeGetString(int resId) {
        try {
            return trimToNull(getString(resId));
        } catch (Throwable t) {
            return null;
        }
    }

    private static Uri safeParseHttpUrl(String url) {
        String u = trimToNull(url);
        if (u == null) return null;

        final Uri uri;
        try {
            uri = Uri.parse(u);
        } catch (Throwable t) {
            return null;
        }

        String scheme = uri.getScheme();
        if (scheme == null) return null;

        if (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme)) {
            return null;
        }
        return uri;
    }

    private static String firstNonBlank(String... values) {
        if (values == null) return null;
        for (String v : values) {
            String t = trimToNull(v);
            if (t != null) return t;
        }
        return null;
    }

    private static String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}
