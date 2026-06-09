#!/bin/bash

case "$1" in
    build_generator)
        echo "Собираем образ генератора..."
        docker build -t generator ./generator
        ;;
    
    run_generator)
        echo "Запускаем генератор..."
        docker run --rm -v $(pwd)/data:/data generator
        ;;
    
    create_local_data)
        echo "Создаём данные локально..."
        python3 generator/generate.py ./local_data
        ;;
    
    build_reporter)
        echo "Собираем образ аналитика..."
        docker build -t reporter ./reporter
        ;;
    
    run_reporter)
        echo "Запускаем аналитика..."
        docker run --rm -v $(pwd)/data:/data reporter
        ;;
    
    structure)
        echo "Структура проекта:"
        find . -type f -not -path './.git/*' -not -path './data/*' -not -path './local_data/*' | sort
        ;;
    
    clear_data)
        echo "Очищаем папку data/..."
        rm -f data/*.csv data/*.html
        echo "Готово. Содержимое data/:"
        ls -la data/
        ;;
    
    inside_generator)
        echo "Запускаем контейнер генератора и показываем содержимое /data изнутри..."
        docker run --rm -v $(pwd)/data:/data generator ls -la /data
        ;;
    
    inside_reporter)
        echo "Запускаем контейнер аналитика и показываем содержимое /data изнутри..."
        docker run --rm -v $(pwd)/data:/data reporter ls -la /data
        ;;
    
    *)
        echo "Использование: $0 {build_generator|run_generator|create_local_data|build_reporter|run_reporter|structure|clear_data|inside_generator|inside_reporter}"
        exit 1
        ;;
esac