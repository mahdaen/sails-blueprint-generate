{# Importing Macros #}
{% import 'components.swig' as comp -%}

<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta Block -->
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
    <meta name="format-detection" content="telephone=no">
    <meta name="description" content="{{ meta.description }}">
    <meta name="keyword" content="{{ meta.keyword }}">

    <!-- Window Title -->
    <title>{{ page.title }}</title>

    <!-- Application Icon -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="{{ path.icon }}/app-icon.144.png"/>
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="{{ path.icon }}/app-icon.114.png"/>
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="{{ path.icon }}/app-icon.72.png"/>
    <link rel="apple-touch-icon-precomposed" href="{{ path.icon }}/app-icon.57.png"/>
    <link rel="shortcut icon" href="{{ path.icon }}/favicon.ico" type="image/vnd.microsoft.icon"/>

    <!-- Stylesheets -->
    {% for cssfile in styles -%}
        <link rel="stylesheet" href="{{ path.style }}/{{ cssfile }}.css"/>
    {%- endfor %}

    {% if settings.env == 'development' -%}
        <!-- Livereload -->
        <script type="text/javascript" src="http://localhost:9090/livereload.js"></script>
    {%- endif %}
</head>
    <body class="application">
    <!-- Header Block -->
    {% block header -%}{%- endblock %}

    <!-- Content Block -->
    {% block content -%}{%- endblock %}

    <!-- Footer Block -->
    {% block footer -%}{%- endblock %}

    <!-- Scripts -->
    {% for jsfile in scripts -%}
        {% if settings.env === 'development' -%}
            <script type="text/javascript" src="{{ path.script }}/{{ jsfile }}.js"></script>
        {% elseif settings.env === 'production' -%}
            <script type="text/javascript" src="{{ path.script }}/{{ jsfile }}.min.js"></script>
        {%- endif %}
    {%- endfor %}
    </body>
</html>