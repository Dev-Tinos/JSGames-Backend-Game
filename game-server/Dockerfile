
# openjdk 17
FROM openjdk:17-jdk-alpine

# copy the packaged jar file into our docker image
COPY build/libs/*.jar /app.jar

# set the startup command to execute the jar
CMD ["java", "-jar", "/app.jar"]