# Paint-Splat!

A new Flutter project.

## How to run the app

1. Install flutter.

```
wget https://storage.googleapis.com/flutter_infra/releases/stable/macos/flutter_macos_1.22.4-stable.zip
unzip flutter_macos_1.22.4-stable.zip
```

2. Add to path for the particular terminal session.

```
export PATH="$PATH:`pwd`/flutter/bin"
```

Use the command below and resolve any major error displayed.
```
flutter doctor
```

Go to webview folder and type the command below:

- If running in a simulator:

```
flutter run
```

- If running in an iPhone:

```
flutter run --release
```

NOTE : You need to add certificate of developer for iPhone build.
