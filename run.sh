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
    
    *)
        echo "Использование: $0 {build_generator|run_generator|create_local_data}"
        exit 1
        ;;
esac