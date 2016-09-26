var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require('connect-flash'),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    Artpiece  = require("./models/artpiece"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds"),
    methodOverride = require('method-override');

    
//requring routes
var commentsRoutes    = require("./routes/comments"),
    artpiecesRoutes = require("./routes/artpieces"),
    indexRoutes      = require("./routes/auth")

var url = process.env.DATABASEURL || 'mongodb://localhost/student_gallery';
mongoose.connect(url);
// mongoose.connect("mongodb://playalink:MoGonzo2015!@ds029426.mlab.com:29426/yelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am living in SLC",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/artpieces", artpiecesRoutes);
app.use("/artpieces/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running...");
});