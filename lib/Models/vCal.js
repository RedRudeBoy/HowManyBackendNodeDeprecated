var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/** CREATE THE SCHEMAS (vEvent & vToDo have the same properties */
var vObj = {
	start: { type: Date, default: Date.now },
	end: { type: Date, default: Date.now },
	//Name
	summary: {
		type: String,
		default: 'summary'
	},
	//Description (@todo, not in to toICal, not standart)
	description: {
		type: String,
		default: 'description'
	},
	url: {
		type: String,
		default: 'url'
	},
	//or is type ObjectId??
	organizer: [ObjectId],
//	organizer: [User],
	categories: {
		type: [String],
		default: 'categories'
	},
	classification: {
		type: String,
		enum: ['PUBLIC','PRIVATE','CONFIDENTIAL'],
		default: 'PRIVATE'
	},
	imageURL: String,
	RepetitionsDone: Number,
	Lang: String
};

var toICal = function(type) {
  var result = []
    , LE = '\r\n'
    ;
	
  result.push('BEGIN:'+type, LE);
  result.push('UID:iCalEvent ', this.id, LE);
  
  if (this.organizer) {
    result.push('ORGANIZER;CN="', this.organizer.name, '":mailto:', this.organizer.email, LE);
  }
  if (this.starts) {
    result.push('DTSTART;VALUE=DATE:', this.starts, LE);
  }
  if (this.ends) {
    result.push('DTEND;VALUE=DATE:', this.ends, LE);
  }
  if (this.url) {
    result.push('URL;VALUE=URI:', this.url, LE);
  }
  if (this.summary) {
    result.push('SUMMARY:', this.summary, LE);
  }
  if (this.categories) {
    result.push('CATEGORIES:', this.categories, LE);
  }
  if (this.classification) {
    result.push('CLASS:', this.classification, LE);
  }

  result.push('END:VEVENT', LE);

  return result.join('');
};

var vEventSchema = new Schema(vObj);
var vToDoSchema = new Schema(vObj);
var vCalSchema = new Schema({
    id: ObjectId,
    version: {
		type: String,
		default: '2.0'
	},
    vClass: {
		type: String,
		default: '-//kurakin//vCal.js v0.1//EN'
	},
	events: [vEventSchema],
	toDos: [vToDoSchema]
});

/* For make a Model Like a Children maybe its this:
var ForumSchema = new mongoose.Schema({
  ...
});
var Forum = db.model("Forum", ForumSchema);

var ThreadSchema = new mongoose.Schema({
  forum: { type: mongoose.ObjectId, ref: 'Forum' },
  ...
});
*/

/** ADD toFile FUNCTION **/
vEventSchema.statics.toICal = toICal; //with 'VEVENT' or 'VTODO' as param
vToDoSchema.statics.toICal = toICal;

vCalSchema.statics.toICal = function(){
  var result = []
    , LE = '\r\n'
    ;

  result.push('BEGIN:VCALENDAR', LE);
  result.push('VERSION:', this.version, LE);
  result.push('PRODID:', this.vClass, LE);
  result.push('CALSCALE:GREGORIAN', LE);

  this.events.forEach(function(evnt){
    result.push(evnt.toICal());
  });
  
  this.toDos.forEach(function(toDo){
    result.push(toDo.toICal());
  });

  result.push('END:VCALENDAR', LE);
  
  return result.join('');
};

//Export the schema
var export_var = {
	schemas: {
		vEventSchema: vEventSchema,
		vToDoSchema: vToDoSchema,
		vCalSchema: vCalSchema
	},
	models: {
		vEventModel: mongoose.model('vEvent', vEventSchema),
		vToDoModel: mongoose.model('vToDo', vToDoSchema),
		vCalModel: mongoose.model('vCal', vCalSchema)
	}
}
module.exports = export_var;
