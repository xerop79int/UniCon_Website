from django.shortcuts import render
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.shortcuts import redirect
from django.core.mail import send_mail
from django.conf import settings
from .models import *
import random
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.http import JsonResponse
from django.core import serializers
from django.http import JsonResponse
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
import datetime

# Create your views here.
class ManagerSigninView(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]
    
    def post(self, req):
        username = req.data.get('username')
        password = req.data.get('password')

        user = auth.authenticate(req, username=username, password=password)
        if user is not None:
            login(req, user)
            token, created = Token.objects.get_or_create(user=user)
            response = Response({'success': 'User logged in successfully.'})
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=400)

    
    
class ManagerSignupView(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]

    def post(self, req):
        first_name = req.data.get('first_name')
        last_name = req.data.get('last_name')
        username = req.data.get('username')
        email = req.data.get('email')
        password = req.data.get('password')
        password2 = req.data.get('password2')

        print(first_name)

        if password == password2:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists.'})
            elif User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists.'})
            else:
                user = User.objects.create_user(first_name=first_name, last_name=last_name, username=username, email=email, password=password)
                user.save()
                rank = Rank(user=user, rank=0)
                rank.save()
                return Response({'success': 'User created successfully.'})
        else:
            return Response({'error': 'Passwords do not match.'})


class ManagerForgetPassword(APIView):    
    def post(self, req):
            email = req.data.get('email')

            # generate a otp for user
            otp = random.randint(100000, 999999)


            try:
                user = User.objects.get(email=email)
                forget = ForgetPassword(user=user, otp=otp)
                forget.save()

                email_from = settings.EMAIL_HOST_USER
                email_subject = "Reset Password"
                email_body = "You have forgot you account password. Your OTP is " + str(otp)
                send_mail(email_subject, email_body, email_from, [email], fail_silently=False)
                return redirect('resetPassword')
            except Exception as e:
                print(e)
                messages.error(req, 'An error accured. Please try again.')
                return render(req, 'forgetPassword.html')
        

class ManagerResetPassword(APIView):
    def post(self, request):
            otp = request.data.get('otp')
            password = request.data.get('password')
            password2 = request.data.get('password2')

            try:
                forget = ForgetPassword.objects.get(otp=otp)
                user = forget.user
                if password == password2:
                    user.set_password(password)
                    user.save()
                    forget.delete()
                    messages.success(request, 'Password reset successfully.')
                    forget.delete()
                    return redirect('login')
                else:
                    messages.error(request, 'Password not matching.')
                    return redirect('resetPassword')
            except:
                messages.error(request, 'Invalid OTP.')
                return redirect('resetPassword')
    
    def get(self, request):
        return render(request, 'resetPassword.html')


class ManagerLogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, req):
        logout(req)
        response = redirect('login')
        response.delete_cookie('token')
        return response

class ManagerVenueView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        title = req.data.get('title')
        subtitle = req.data.get('subtitle')
        description = req.data.get('description')
        location = req.data.get('location')
        date = req.data.get('date')
        website = req.data.get('website')
        email = req.data.get('email')

        title = title.replace(" ", "_")
        # check if venue already exists and if not create a new venue

        try:
            venue = Venue.objects.get(Venue_name=title)
            return Response({'error': 'Venue already exists.'})
        except Venue.DoesNotExist:
            venue = Venue.objects.create(Venue_name=title, subtitle=subtitle, description=description, location=location, date=date, website=website, email=email)
            venue.save()
            return Response({'success': 'Venue created successfully.'})
        
    def get(self, req):
        venues = Venue.objects.all()
        data = {'venues': list(venues.values())}
        return JsonResponse(data, content_type='application/json')
        

class ManagerSingleVenueView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def put(self, req):
        title = req.data.get('title')
        subtitle = req.data.get('subtitle')
        description = req.data.get('description')
        location = req.data.get('location')
        date = req.data.get('date')
        website = req.data.get('website')
        email = req.data.get('email')

        try:
            venue = Venue.objects.get(Venue_name=title)
            venue.subtitle = subtitle
            venue.description = description
            venue.location = location
            venue.date = date
            venue.website = website
            venue.email = email
            venue.save()
            messages.success(req, 'Venue updated successfully.')
            return redirect('venue')
        except Venue.DoesNotExist:
            messages.error(req, 'Venue does not exists.')
            return redirect('venue')
    
    def get(self, req, venue):
        try:
            venue = Venue.objects.get(Venue_name=venue)
            venue_dict = serializers.serialize('python', [venue])[0]['fields']
            return JsonResponse(venue_dict, content_type='application/json', safe=False)
        except Venue.DoesNotExist:
            return Response({'error': 'Venue does not exists.'})

class ManagerResearchPaperView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req, venue, paper):
        user = req.user
        venue = req.data.get('venue')
        title = req.data.get('title')
        abstract = req.data.get('abstract')
        pdf = req.data.get('pdf')
        authors = req.data.get('authors')
        code = req.data.get('code')

        title = title.replace(" ", "_")
        # check if research paper already exists and if not create a new research paper

        try:
            research = ResearchPaper.objects.get(Research_Paper_name=title, Venue=venue)
            return Response({'error': 'Research Paper already exists.'})
        except ResearchPaper.DoesNotExist:
            venue = Venue.objects.get(Venue_name=venue)
            research = ResearchPaper.objects.create(Venue=venue, Research_Paper_name=title, Code=code, Abstract=abstract, Research_Paper_file=pdf)
            research.Authors.set(user)
            research.Authors.set(authors)
            research.save()

            # send a notification to all the users who are following the venue
            try:
                subscribe = Subscribe.objects.filter(Venue=venue)
                for sub in subscribe:
                    user = sub.user
                    notification = Notifications.objects.create(user=user, message=f'A new paper has been added to {venue}.', link=f'/venues/{venue}/{title}')
                    notification.save()
            except:
                pass

            return Response({'success': 'Research Paper created successfully.'})
    
    def get(self, req, venue, paper):
        paper = ResearchPaper.objects.get(Research_Paper_name=paper)
        paper.Research_Paper_file = 'http://127.0.0.1:8000' + paper.Research_Paper_file.url
        paper_dict = serializers.serialize('python', [paper])[0]['fields']
        return JsonResponse(paper_dict, content_type='application/json', safe=False)

class ManagerVenuesResearchPaperView(APIView):
        authentication_classes = [TokenAuthentication]
        permission_classes = [permissions.IsAuthenticated]

        def get(self, req, venue, paper):
            venue = Venue.objects.get(Venue_name=venue)
            papers = ResearchPaper.objects.filter(Venue=venue)
            data = {'papers': list(papers.values())}
            return JsonResponse(data, content_type='application/json')

class ManagerCommentsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req, paper):
        user = req.user
        comment = req.data.get('comment')
        paper = req.data.get('paper')
        parent_comment = req.data.get('parent')
        paper = ResearchPaper.objects.get(Research_Paper_name=paper)
        if parent_comment != None:
            parent_comment = Comments.objects.get(id=parent_comment)
        comment = Comments.objects.create(User=user, Comment=comment, ResearchPaper=paper, parent_comment=parent_comment)
        comment.save()
        comments = Comments.objects.filter(ResearchPaper=paper)

        def get_nested_comments(comment):
            nested_comments = []
            children = Comments.objects.filter(parent_comment=comment)
            for child in children:
                likes = Like.objects.filter(post=comment, value='Like').count()
                unlikes = Like.objects.filter(post=comment, value='Unlike').count()
                nested_comments.append({
                    'id': child.id,
                    'user': child.User.username,
                    'comment': child.Comment,
                    'visibility': child.Visibility,
                    'likes': likes,
                    'unlikes': unlikes,
                    'children': get_nested_comments(child)
                })
            return nested_comments
        
        # Create a list of top-level comments
        top_level_comments = []
        for comment in comments.filter(parent_comment=None):
            likes = Like.objects.filter(post=comment, value='Like').count()
            unlikes = Like.objects.filter(post=comment, value='Unlike').count()
            top_level_comments.append({
                'id': comment.id,
                'user': comment.User.username,
                'comment': comment.Comment,
                'visibility': comment.Visibility,
                'likes': likes,
                'unlikes': unlikes,
                'children': get_nested_comments(comment)
            })

        
        return Response({'success': 'Comment created successfully.', 'comments': top_level_comments})

    
    def get(self, req, paper):
        paper = ResearchPaper.objects.get(Research_Paper_name=paper)
        comments = Comments.objects.filter(ResearchPaper=paper)

        def get_nested_comments(comment):
            nested_comments = []
            children = Comments.objects.filter(parent_comment=comment)
            for child in children:
                likes = Like.objects.filter(post=comment, value='Like').count()
                unlikes = Like.objects.filter(post=comment, value='Unlike').count()
                nested_comments.append({
                    'id': child.id,
                    'user': child.User.username,
                    'comment': child.Comment,
                    'visibility': child.Visibility,
                    'likes': likes,
                    'unlikes': unlikes,
                    'children': get_nested_comments(child)
                })
            return nested_comments
        
        # Create a list of top-level comments
        top_level_comments = []
        for comment in comments.filter(parent_comment=None):
            likes = Like.objects.filter(post=comment, value='Like').count()
            unlikes = Like.objects.filter(post=comment, value='Unlike').count()
            top_level_comments.append({
                'id': comment.id,
                'user': comment.User.username,
                'comment': comment.Comment,
                'visibility': comment.Visibility,
                'likes': likes,
                'unlikes': unlikes,
                'children': get_nested_comments(comment)
            })

        return JsonResponse(top_level_comments, content_type='application/json', safe=False)


class ManagerUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, req, user):
        user = User.objects.get(username=user)
        rank = Rank.objects.get(user=user)
        print(rank.rank)
        if rank.rank < 100:
            ranking = 'Rank 0'
            point = rank.rank
        elif rank.rank >= 700:
            ranking = 'Rank 7'
            point = rank.rank
        elif rank.rank >= 600:
            ranking = 'Rank 6'
            point = rank.rank
        elif rank.rank >= 500:
            ranking = 'Rank 5'
            point = rank.rank
        elif rank.rank >= 400:
            ranking = 'Rank 4'
            point = rank.rank
        elif rank.rank >= 300:
            ranking = 'Rank 3'
            point = rank.rank
        elif rank.rank >= 200:
            ranking = 'Rank 2'
            point = rank.rank
        elif rank.rank >= 100:
            ranking = 'Rank 1'
            point = rank.rank
        


        data = {'user': []}
        data['user'].append({
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'username': user.username,
                'email': user.email,
                'ranking': ranking,
                'points': point
        })
        return JsonResponse(data, content_type='application/json')

class ManagerCommentLikeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # TODO:
    # 1. Check if user already liked the comment and is disliking it now.
    # 2. Check if user already disliked the comment and is liking it now.
    # 3. Add the ranking if Author +5 for like and -5 for dislike.
    # 4. Add the ranking if general user +1 for like and -1 for dislike.    

    def get(self, req, comment, data):
        user = req.user

        if data == 'like':
            comment = Comments.objects.get(id=comment)
            # check if user already liked the comment
            try:
                like = Like.objects.get(user=user, post=comment, value='Like')
                return Response({'error': 'Comment already liked.'})
            except Like.DoesNotExist:
                # check if user already disliked the comment
                try:
                    unlike = Like.objects.get(user=user, post=comment, value='Unlike')
                    unlike.delete()
                except:
                    pass


                like = Like.objects.create(user=user, post=comment, value='Like')
                like.save()
                
                try:
                    rank = Rank.objects.get(user=user)
                    if comment.Author == user:
                        rank.rank += 5
                    else:
                        rank.rank += 1
                    rank.save()
                except:
                    pass

                notification = Notifications.objects.create(user=comment.User, message=f'{user.username} liked your comment.', link=f'/venues/{comment.ResearchPaper.Venue}/{comment.ResearchPaper.Research_Paper_name}')
                notification.save()
                

                likes = Like.objects.filter(post=comment, value='Like')
                unlikes = Like.objects.filter(post=comment, value='Unlike')
                count_like = likes.count()
                count_unlike = unlikes.count()
                data = {'likes': count_like, 'unlikes': count_unlike}
                return Response({'success': 'Comment liked successfully.', 'data': data})
        elif data == 'unlike':
            comment = Comments.objects.get(id=comment)
            # check if user already liked the comment
            try:
                unlike = Like.objects.get(user=user, post=comment, value='Unlike')
                return Response({'error': 'Comment already liked.'})
            except Like.DoesNotExist:
                # check if user already liked the comment
                try:
                    like = Like.objects.get(user=user, post=comment, value='Like')
                    like.delete()
                except:
                    pass

                unlike = Like.objects.create(user=user, post=comment, value='Unlike')
                unlike.save()

                try:
                    rank = Rank.objects.get(user=user)
                    if comment.Author == user:
                        rank.rank -= 5
                    else:
                        rank.rank -= 1
                    rank.save()
                except:
                    pass

                notification = Notifications.objects.create(user=comment.User, message=f'{user.username} disliked your comment.', link=f'/venues/{comment.ResearchPaper.Venue}/{comment.ResearchPaper.Research_Paper_name}')
                notification.save()
                                                            


                likes = Like.objects.filter(post=comment, value='Like').count()
                unlikes = Like.objects.filter(post=comment, value='Unlike').count()
                count_like = likes.count()
                count_unlike = unlikes.count()
                data = {'likes': count_like, 'unlikes': count_unlike}
                return Response({'success': 'Comment liked successfully.', 'data': data})


class ManagerChatView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, req, paper):
        sender = req.user
        paper = ResearchPaper.objects.get(Research_Paper_name=paper)
        message = req.data.get('message')
        chat = Message.objects.create(sender=sender, Paper=paper, body=message)
        chat.save()

        chats = Message.objects.filter(Paper=paper)
        chats = chats.order_by('created_at')
        data = {'chats': []}
        for chat in chats:
            if chat.sender == sender:
                data['chats'].append({
                    'id': chat.id,
                    'sender': chat.sender.username,
                    'message': chat.body,
                    'personal': 'true'
                })
            else:
                data['chats'].append({
                    'id': chat.id,
                    'sender': chat.sender.username,
                    'message': chat.body,
                })
        
        return JsonResponse(data, content_type='application/json')
    
    def get(self, req, paper):
        sender = req.user
        try:
            paper = ResearchPaper.objects.get(Research_Paper_name=paper)
            chats = Message.objects.filter(Paper=paper)
            chats = chats.order_by('created_at')
            data = {'chats': []}
            for chat in chats:
                if chat.sender == sender:
                    data['chats'].append({
                        'id': chat.id,
                        'sender': chat.sender.username,
                        'message': chat.body,
                        'personal': 'true'
                    })
                else:
                    data['chats'].append({
                        'id': chat.id,
                        'sender': chat.sender.username,
                        'message': chat.body,
                    })
            return JsonResponse(data, content_type='application/json')
        except:
            return Response({'error': 'No chats found.'})

class ManagerNotificationsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, req):
        user = req.user
        notifications = Notifications.objects.filter(user=user)
        data = {'notifications': []}
        for notification in notifications:
            data['notifications'].append({
                'id': notification.id,
                'message': notification.message,
                'link': notification.link,
            })
        return JsonResponse(data, content_type='application/json')

    def post(self, req, notification):
        user = req.user
        notification = Notifications.objects.get(id=notification)
        if notification.user == user:
            notification.delete()
            return Response({'success': 'Notification deleted successfully.'})
        else:
            return Response({'error': 'You are not allowed to delete this notification.'})

class ManagerSubscribeView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req, venue):
        user = req.user
        print(user)
        user = User.objects.get(username=user)
        try:
            subscribe = Subscribe.objects.get(user=user, venue=venue)
            return Response({'success': 'Subscribed successfully.'})
        except Subscribe.DoesNotExist:
            subscribe = Subscribe.objects.create(user=user)
            subscribe.save()
            return Response({'success': 'Subscribed successfully.'})

    # def get(self, req, venue):
    #     user = req.user
    #     user = User.objects.get(username=user)
    #     try:
    #         subscribe = Subscribe.objects.get(user=user, venue=venue)
    #         return Response({'success': 'Subscribed successfully.'})
    #     except Subscribe.DoesNotExist:
    #         subscribe = Subscribe.objects.create(user=user)
    #         subscribe.save()
    #         return Response({'success': 'Subscribed successfully.'})

    