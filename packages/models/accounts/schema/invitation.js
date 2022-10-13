import {Schema} from 'mongoose';

const Invitations = new Schema({
  subdomain: {
    type:String,
    required: true
  },
  type: {
    type:String,
    required: true,
    enum: ['collaborator', 'single']
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blogs'
  },
  blogOwner: {
    type: Schema.Types.ObjectId,
    ref: 'BlogAccount'
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'expired', 'accepted']
  },
  expireIn: {
    type: Date,
    default:() => (Date.now() + (60 * 60 * 24)),
    required: true
  }
});

export default Invitations;
