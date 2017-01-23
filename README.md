# Installation

## Dependencies

```npm install```

```bower install```

## Configuration

The gooogle play certificate should be at ```certificates/google-play-key.keystore```

## Plugins and Platforms

```ionic state restore```

# Workflow

## Browser Run

```gulp web:run -e staging```

```gulp web:run -e production```

## Device Run

```gulp android:run -e staging```

```gulp android:run -e production```

## Device Release

```gulp android:release -v 1.0.0 -c 100 -e production```

# Usage

All the source files are inside /src

All the output files are inside /www

All the configuration files are inside /config

All the custom css and js files should be declared at  src/assets.json