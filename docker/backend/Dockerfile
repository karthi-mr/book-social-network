# Build stage
FROM maven:latest AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:21

# define few things
ARG PROFILE=dev
ARG APP_VERSION=1.0.0


WORKDIR /app
COPY --from=build /build/target/book-network-*.jar /app/

EXPOSE 8088

ENV DB_URL = jdbc:postgresql://localhost:5433/book_social_network
ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}

CMD java -jar -Dspring.profile.active=${ACTIVE_PROFILE} book-network-${JAR_VERSION}.jar
