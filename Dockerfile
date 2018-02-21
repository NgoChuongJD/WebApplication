FROM microsoft/aspnetcore
WORKDIR /app
COPY . .
ENTRYPOINT ["dotnet", "Euroland.NetCore.AnnualReport.WebApp.dll"]