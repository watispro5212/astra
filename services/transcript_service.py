import discord
import io
import datetime
from typing import List

class TranscriptService:
    """Generates professional archives for support sessions."""
    
    @staticmethod
    async def generate_text_transcript(channel: discord.TextChannel, limit: int = 500) -> discord.File:
        """Creates a plain-text archive of the channel messages."""
        messages: List[discord.Message] = []
        async for msg in channel.history(limit=limit, oldest_first=True):
            messages.append(msg)

        content = [
            f"--- ASTRA TICKET TRANSCRIPT ---",
            f"Channel: #{channel.name} (ID: {channel.id})",
            f"Server: {channel.guild.name}",
            f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Message Count: {len(messages)}",
            "-" * 40,
            ""
        ]

        for msg in messages:
            timestamp = msg.created_at.strftime("%Y-%m-%d %H:%M")
            author = f"{msg.author.name}#{msg.author.discriminator}" if msg.author.discriminator != '0' else msg.author.name
            
            line = f"[{timestamp}] {author}: {msg.clean_content}"
            if msg.attachments:
                line += f" [Attachments: {len(msg.attachments)}]"
            if msg.embeds:
                line += f" [Embeds: {len(msg.embeds)}]"
                
            content.append(line)

        content.append("\n" + "-" * 40)
        content.append("--- END OF TRANSCRIPT ---")

        # Create file-like object
        buffer = io.BytesIO("\n".join(content).encode("utf-8"))
        filename = f"transcript-{channel.name}-{datetime.datetime.now().strftime('%Y%m%d-%H%M')}.txt"
        
        return discord.File(fp=buffer, filename=filename)

transcript_service = TranscriptService()
