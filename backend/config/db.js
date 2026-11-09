const dns = require("dns");
const mongoose = require("mongoose");

// Optional DNS override for mongodb+srv:// connection strings (MongoDB Atlas).
// On some networks (often Windows with IPv6-only DNS from the router) Node's
// resolver falls back to 127.0.0.1 for SRV lookups and fails with
// "querySrv ECONNREFUSED". Setting DNS_SERVERS, for example "8.8.8.8,1.1.1.1",
// makes Node send those lookups to the listed servers instead.
const applyDnsServers = () => {
    const servers = (process.env.DNS_SERVERS || "")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);
    if (servers.length > 0) dns.setServers(servers);
};

const connectDB = async () => {
    try {
        applyDnsServers();
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed.", err);
        if (err.syscall === "querySrv" || /querySrv/.test(err.message)) {
            console.error(
                "\nCould not resolve the mongodb+srv:// address. Your system DNS does not answer " +
                    "SRV lookups from Node. Add DNS_SERVERS=8.8.8.8,1.1.1.1 to backend/.env and try again."
            );
        }
        process.exit(1);
    }
};

module.exports = connectDB;
