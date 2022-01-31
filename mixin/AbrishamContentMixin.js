import axios from 'axios'
import { Content } from '@/models/Content';

const AbrishamContentMixin = {
    methods: {
        syncCurrentContentWithContentInList () {
            let targetContentIndex = this.contents.list.indexOf( item => item.id === this.currentContent.id)
            if (!targetContentIndex) {
                return false
            }

            this.contents.list[targetContentIndex] = new Content(this.currentContent)
        },
        toggleFavor () {
            this.currentContent.loading = true
            if (this.currentContent.is_favored) {
                this.setUnfavored()
            } else {
                this.setFavored()
            }
        },
        watched () {
            this.currentContent.loading = true
            if(!this.currentContent.has_watched){
              this.$axios.post('/alaa/api/v2/watched', {
                    watchable_id: this.currentContent.id,
                    watchable_type: 'content'
                })
                    .then( () => {
                        this.currentContent.has_watched = true
                        this.currentContent.loading = false
                        this.syncCurrentContentWithContentInList()
                    })
                    .catch( () => {
                        this.currentContent.loading = false
                    })
            }else {
              this.$axios.post('/alaa/api/v2/unwatched', {
                    watchable_id: this.currentContent.id,
                    watchable_type: 'content'
                })
                    .then( () => {
                        this.currentContent.has_watched = false
                        this.currentContent.loading = false
                        this.syncCurrentContentWithContentInList()
                    })
                    .catch( () => {
                        this.currentContent.loading = false
                    })
            }
        },
        setFavored () {
          this.$axios.post('/alaa/api/v2/c/'+this.currentContent.id+'/favored')
                .then( () => {
                    this.currentContent.is_favored = true
                    this.currentContent.loading = false
                    this.syncCurrentContentWithContentInList()
                })
                .catch( () => {
                    this.currentContent.loading = false
                })
        },
        setUnfavored () {
          this.$axios.post('/alaa/api/v2/c/'+this.currentContent.id+'/unfavored')
                .then( () => {
                    this.currentContent.is_favored = false
                    this.currentContent.loading = false
                    this.syncCurrentContentWithContentInList()
                })
                .catch( () => {
                    this.currentContent.loading = false
                })
        },
        saveComment (comment) {
            if (this.currentContent.comments[0]) {
              this.$axios.post('/alaa/api/v2/comment/' + this.currentContent.comments[0].id, {
                    comment: comment,
                    _method: 'PUT'
                })
                    .then(response => {
                        this.currentContent.comments[0].comment = response.data.data.comment
                        this.comment = this.currentContent.comments[0].comment
                        this.syncCurrentContentWithContentInList()
                    })
            } else {
              this.$axios.post('/alaa/api/v2/comment', {
                    commentable_id: this.currentContent.id,
                    commentable_type: 'content',
                    comment: comment
                })
                    .then(response => {
                        this.currentContent.comments.push({
                            id: response.data.data.id,
                            comment: response.data.data.comment
                        })
                        this.comment = this.currentContent.comments[0].comment
                        this.syncCurrentContentWithContentInList()
                    })
            }
        },
        // toggleBookmarkFavorite(id , event){
        //     let that = this
        //     this.timePoints.forEach( function (item) {
        //         if (parseInt(item.id) === parseInt(id)) {
        //             item.loading = true
        //             item.isFavored = !!!item.isFavored
        //             that.bookmarkPostIsFavored({
        //                 'id' : item.id,
        //                 'isFavored' : item.isFavored
        //             } )
        //         }
        //     })
        //     var requiredElement = document.querySelector('.video-js')
        //     requiredElement.focus()
        // },
        bookmarkPostIsFavored(timeStampData){
            var postStatus = 'unfavored'
            let that = this
            if (timeStampData.isFavored){
                postStatus = 'favored'
            }
            // /api/v2/timepoint/{timepoint_id}/favored
          this.$axios.post('/alaa/api/v2/c/timepoint/' + parseInt(timeStampData.id) + '/'+ postStatus)
                .then(response => {
                    if (response.status === 200){
                        this.currentContent.timepoints.list.forEach( function (item) {
                            if (parseInt(item.id) === parseInt(timeStampData.id)) {
                                item.loading = false
                                if (postStatus === 'favored'){
                                    that.currentContent.timepoints.list[timeStampData.numberOfTimestamp].isFavored = true
                                }
                                else if (postStatus === 'unfavored'){
                                    that.currentContent.timepoints.list[timeStampData.numberOfTimestamp].isFavored = false
                                }
                            }
                        })

                        this.syncCurrentContentWithContentInList()
                    }
                })
                .catch(err => console.error(err));
        },
    }
};

export default AbrishamContentMixin;
