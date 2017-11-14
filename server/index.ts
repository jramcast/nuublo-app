import Nuublo from './application/Nuublo';
import settings from './settings';
import webserver from './infrastructure/ExpressWebServer';
import TwitterStream from './infrastructure/TwitterStream';
import FakeClassifier from './infrastructure/FakeClassifier';
import MachineLearningClassifier from './infrastructure/MachineLearningClassifier';


const stream = new TwitterStream(settings.twitter);
const classifier = new FakeClassifier();
// Uncomment to use real classifier
// const classifier = new MachineLearningClassifier(settings.classifier.url);
const options = { settings, webserver, stream, classifier };

Nuublo.start(options);
