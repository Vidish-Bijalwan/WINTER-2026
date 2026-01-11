"""
Seed data for free public data sources
Organized by category for TopoShape Insights anomaly detection
"""

SOURCES_DATA = [
    # Social Media
    {
        "name": "Mastodon Public Timeline",
        "url": "https://mastodon.social/api/v1/streaming/public",
        "type": "Social Media",
        "protocol": "WebSocket/SSE",
        "description": "Decentralized social network posts - detect coordinated misinformation campaigns",
        "active": False
    },
    {
        "name": "Reddit PushShift API",
        "url": "https://api.pushshift.io/reddit/stream/comments",
        "type": "Social Media",
        "protocol": "REST Stream",
        "description": "Real-time Reddit comments/submissions - detect brigading and bot activity",
        "active": False
    },
    {
        "name": "Bluesky Firehose",
        "url": "wss://bsky.social/xrpc/com.atproto.sync.subscribeRepos",
        "type": "Social Media",
        "protocol": "WebSocket",
        "description": "Decentralized Twitter alternative feed - social network topology analysis",
        "active": False
    },
    
    # News & Media
    {
        "name": "EventRegistry News Stream",
        "url": "http://eventregistry.org/api/v1/stream",
        "type": "News & Media",
        "protocol": "REST API",
        "description": "Global news articles in real-time - track coordinated narratives (2000 req/day free)",
        "active": False
    },
    {
        "name": "GDELT Project",
        "url": "http://data.gdeltproject.org/gdeltv2/lastupdate.txt",
        "type": "News & Media",
        "protocol": "File Stream",
        "description": "Global events database - geopolitical anomaly detection (updated every 15min)",
        "active": False
    },
    {
        "name": "NewsAPI.org",
        "url": "https://newsapi.org/v2/everything",
        "type": "News & Media",
        "protocol": "REST",
        "description": "News headlines from 80+ sources - media coordination patterns (100 req/day free)",
        "active": False
    },
    
    # Development & Tech
    {
        "name": "GitHub Events",
        "url": "https://api.github.com/events",
        "type": "Development",
        "protocol": "REST",
        "description": "Public repo activity - detect coordinated repository attacks (poll every 60s)",
        "active": False
    },
    {
        "name": "Stack Overflow Activity",
        "url": "https://api.stackexchange.com/2.3/questions?order=desc&sort=activity&site=stackoverflow",
        "type": "Development",
        "protocol": "REST",
        "description": "Questions, answers, votes - spam/bot detection (10k req/day)",
        "active": False
    },
    {
        "name": "npm Registry Stream",
        "url": "https://replicate.npmjs.com/_changes?feed=continuous",
        "type": "Development",
        "protocol": "CouchDB Feed",
        "description": "Package publish events - detect malicious package campaigns",
        "active": False
    },
    
    # Geographic & Environmental
    {
        "name": "USGS Earthquake Feed",
        "url": "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson",
        "type": "Environmental",
        "protocol": "GeoJSON",
        "description": "Real-time seismic activity - geographic clustering analysis (updated every 5min)",
        "active": False
    },
    {
        "name": "OpenSky Network Aviation",
        "url": "https://opensky-network.org/api/states/all",
        "type": "Geographic",
        "protocol": "REST",
        "description": "Live aircraft positions worldwide - flight pattern anomalies",
        "active": False
    },
    {
        "name": "OpenWeatherMap Stream",
        "url": "http://api.openweathermap.org/data/2.5/weather",
        "type": "Environmental",
        "protocol": "REST",
        "description": "Weather conditions - environmental event correlation (1000 calls/day free)",
        "active": False
    },
    {
        "name": "PurpleAir Air Quality",
        "url": "https://www.purpleair.com/json",
        "type": "Environmental",
        "protocol": "JSON",
        "description": "PM2.5 sensor readings - pollution event detection",
        "active": False
    },
    {
        "name": "NOAA Weather Stations",
        "url": "https://w1.weather.gov/xml/current_obs/",
        "type": "Environmental",
        "protocol": "XML Feed",
        "description": "Weather observations - climate anomalies",
        "active": False
    },
    
    # Financial Markets
    {
        "name": "Alpha Vantage Stock Data",
        "url": "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY",
        "type": "Finance",
        "protocol": "REST",
        "description": "Stock prices, forex, crypto - market manipulation detection (5 calls/min free)",
        "active": False
    },
    {
        "name": "CoinCap WebSocket",
        "url": "wss://ws.coincap.io/prices?assets=ALL",
        "type": "Finance",
        "protocol": "WebSocket",
        "description": "Real-time crypto prices - pump-and-dump schemes detection",
        "active": False
    },
    {
        "name": "Binance Public Stream",
        "url": "wss://stream.binance.com:9443/ws/!ticker@arr",
        "type": "Finance",
        "protocol": "WebSocket",
        "description": "All crypto tickers - coordinated trading detection",
        "active": False
    },
    
    # Cybersecurity
    {
        "name": "GreyNoise Community API",
        "url": "https://api.greynoise.io/v3/community/",
        "type": "Cybersecurity",
        "protocol": "REST",
        "description": "Internet scanner activity - coordinated scanning campaigns",
        "active": False
    },
    {
        "name": "AbuseIPDB",
        "url": "https://api.abuseipdb.com/api/v2/check",
        "type": "Cybersecurity",
        "protocol": "REST",
        "description": "IP reputation data - botnet detection (1000 checks/day free)",
        "active": False
    },
    
    # Gaming & Entertainment
    {
        "name": "Twitch Helix API",
        "url": "https://api.twitch.tv/helix/streams",
        "type": "Gaming",
        "protocol": "REST",
        "description": "Live stream metadata - viewer bot detection",
        "active": False
    },
    {
        "name": "Steam Web API",
        "url": "https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/",
        "type": "Gaming",
        "protocol": "REST",
        "description": "Game updates, player counts - game launch anomalies",
        "active": False
    },
    
    # Music & Culture
    {
        "name": "Last.fm API",
        "url": "https://ws.audioscrobbler.com/2.0/",
        "type": "Culture",
        "protocol": "REST",
        "description": "Music listening trends - cultural trend analysis",
        "active": False
    },
    {
        "name": "Spotify Charts",
        "url": "https://charts.spotify.com/api/",
        "type": "Culture",
        "protocol": "REST",
        "description": "Streaming charts - viral song detection",
        "active": False
    },
    
    # Government & Public Data
    {
        "name": "NYC Open Data 311",
        "url": "https://data.cityofnewyork.us/api/views/",
        "type": "Government",
        "protocol": "Socrata API",
        "description": "311 calls, traffic, permits - urban anomaly detection",
        "active": False
    },
    {
        "name": "USA.gov Federal APIs",
        "url": "https://api.data.gov/",
        "type": "Government",
        "protocol": "REST",
        "description": "Government data streams - policy impact analysis",
        "active": False
    },
]
