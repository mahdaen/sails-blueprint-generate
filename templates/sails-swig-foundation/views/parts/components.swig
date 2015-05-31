{# Create Swig Macros Here #}
{# Macros Listed Here Will Available To All Views #}

{% macro attributes(attr) %}
    {% set atv = '' %}

    {% for key, value in attr -%}
        {% set atv = atv + key + '="' + value + '" ' %}
    {%- endfor %}

    {{ atv }}
{% endmacro %}