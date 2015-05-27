{# Glyphicon #}
{% macro glyphicon(icon) %}
    <span class="glyphicon glyphicon-{{ icon }}" aria-hidden="true"></span>
{% endmacro %}

{# Dropdown Macro #}
{% macro dropdown(title, options, cls, id) %}
    <div class="dropdown">
        <button class="btn btn-default dropdown-toggle{% if cls-%}{{ ' ' + cls}}{%- endif %}" type="button" id="{{ id }}" data-toggle="dropdown">
            <span class="text">{{ title }}</span>
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
            {% for item in options -%}
                <li role="presentation">
                    <a {% if item.cls-%}class="{{ item.cls}}" {%- endif %}role="menuitem" tabindex="-1" href="{{ item.value }}">{{ item.title }}</a>
                </li>
            {%- endfor %}
        </ul>
    </div>
{% endmacro %}

{# Drop Up macro #}
{% macro dropup(title, options, cls, id) %}
    <div class="dropup">
        <button class="btn btn-default dropdown-toggle{% if cls-%}{{ ' ' + cls}}{%- endif %}" type="button" id="{{ id }}" data-toggle="dropdown">
            <span class="text">{{ title }}</span>
            <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu2">
            {% for item in options -%}
                <li role="presentation">
                    <a {% if item.cls-%}class="{{ item.cls}}" {%- endif %}role="menuitem" tabindex="-1" href="{{ item.value }}">{{ item.title }}</a>
                </li>
            {%- endfor %}
        </ul>
    </div>
{% endmacro %}

{# Button Group Macro #}
{% macro buttongroup(buttons, cls, label) %}
    {% if label === 'undefined' -%}
        {% set label = '...' %}
    {%- endif %}
    <div class="btn-group{% if cls-%}{{ ' ' + cls}}{%- endif %}" role="group" aria-label="{{ label }}">
        {% for button in buttons -%}
            <button type="button" class="btn btn-default{% if button.cls-%}{{ ' ' + button.cls}}{%- endif %}">{{ button.text }}</button>
        {%- endfor %}
    </div>
{% endmacro %}

