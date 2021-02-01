// import 'package:flutter/material.dart';
// import 'package:webview_flutter/webview_flutter.dart';
// import 'package:flutter/services.dart';
// void main() => runApp(MyApp());

// class MyApp extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     SystemChrome.setPreferredOrientations([
//     // DeviceOrientation.landscapeLeft,
//     DeviceOrientation.landscapeRight,
//     ]);
//     return MaterialApp(
//       title: 'Paint Splat!',
//       home: Scaffold(
//         appBar: AppBar(
//         title: Text('Paint Splat!'),
//         ),
//         body: WebView(initialUrl: "https://cccaab6b882e.ngrok.io/",
//         javascriptMode: JavascriptMode.unrestricted),
//       ),
//     );
//   }
// }



import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:flutter/services.dart';

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(new MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => new _MyAppState();
}

class _MyAppState extends State<MyApp> {
  InAppWebViewController webView;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    // DeviceOrientation.landscapeRight,
    ]);
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Paint Splat!'),
        ),
        body: Container(
            child: Column(children: <Widget>[
          Expanded(
              child: InAppWebView(
            initialUrl:
                "https://cccaab6b882e.ngrok.io/",
            initialHeaders: {},
            initialOptions: InAppWebViewGroupOptions(
              crossPlatform: InAppWebViewOptions(
                  debuggingEnabled: true,
                  preferredContentMode: UserPreferredContentMode.DESKTOP),
            ),
            onWebViewCreated: (InAppWebViewController controller) {
              webView = controller;
            },
            onLoadStart: (InAppWebViewController controller, String url) {

            },
            onLoadStop: (InAppWebViewController controller, String url) async {

            },
          ))
        ])),
      ),
    );
  }
}


// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:webview_flutter/webview_flutter.dart';
// import 'package:flutter/services.dart';

// void main() => runApp(WebViewGuide());

// class WebViewGuide extends StatefulWidget {
//   final String guideUrl;

//   WebViewGuide({this.guideUrl});

//   @override
//   _WebViewGuideState createState() => new _WebViewGuideState();
// }

// class _WebViewGuideState extends State<WebViewGuide> {
//   double webViewWidth;
//   String guideUrl;
//   WebViewController _webViewController;

//   @override
//   void initState() {
//     super.initState();
//     guideUrl = widget.guideUrl;
//   }

//   @override
//   void dispose() {
//     _webViewController = null;
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//      SystemChrome.setPreferredOrientations([
//     // DeviceOrientation.landscapeLeft,
//     DeviceOrientation.landscapeRight,
//     ]);
//     return Container(
//       width: webViewWidth != null ? webViewWidth : 1792,
//       child: WebView(
//         javascriptMode: JavascriptMode.unrestricted,
//         initialUrl: "https://cccaab6b882e.ngrok.io/",
//         onWebViewCreated: (WebViewController webViewController) {
//           _webViewController = webViewController;
//         },
//         onPageFinished: (some) async {
//           if (_webViewController != null) {
//             webViewWidth = double.tryParse(
//               await _webViewController
//                   .evaluateJavascript("document.documentElement.scrollWidth;"),
//             );
//             setState(() {});
//           }
//         },
//       ),
//     );
//   }
// }